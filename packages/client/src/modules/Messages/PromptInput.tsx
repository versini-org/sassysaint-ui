import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@versini/ui-components";
import { TextArea } from "@versini/ui-form";
import React, { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
	ACTION_MESSAGE,
	ACTION_MODEL,
	ACTION_STREAMING,
	ERROR_MESSAGE,
	MODEL_GPT4,
	ROLE_ASSISTANT,
	ROLE_HIDDEN,
	ROLE_INTERNAL,
	ROLE_SYSTEM,
	ROLE_USER,
	STATS_SEPARATOR,
} from "../../common/constants";
import { serviceCall } from "../../common/services";
import {
	FAKE_USER_EMAIL,
	LOG_IN,
	SEND,
	TYPE_QUESTION,
} from "../../common/strings";
import { isProd } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export type onPromptInputSubmitProps = {
	message: {
		content: string;
		role: string;
	};
};

export const PromptInput = () => {
	/**
	 * Save all messages to the state in order to keep track of
	 * the whole conversation. This is needed so that the
	 * gpt engine can generate a response based on context.
	 */
	const { state, dispatch } = useContext(AppContext);
	const [userInput, setUserInput] = useState("");
	const { loginWithRedirect, isAuthenticated, user } = useAuth0();

	const inputFocusedRef = useRef(false);
	const inputRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
	const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
		null,
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		(async () => {
			if (!state || state.messages.length === 0) {
				// cancel the reader stream if there are no messages (e.g. on chat reset)
				readerRef?.current?.cancel();
				return;
			}

			const lastMessage = state.messages[state.messages.length - 1];
			if (
				state.messages.length === 0 ||
				lastMessage.message.role === ROLE_ASSISTANT ||
				lastMessage.message.role === ROLE_SYSTEM ||
				lastMessage.message.role === ROLE_INTERNAL ||
				lastMessage.message.role === ROLE_HIDDEN
			) {
				// the last message is not from the user, ignoring
				return;
			}

			try {
				const response = await serviceCall({
					name: "generate",
					data: {
						messages: state.messages,
						model: MODEL_GPT4,
						user: user?.email || FAKE_USER_EMAIL,
						id: state.id,
						location: state.location,
					},
				});
				if (response && response.ok) {
					const messageId = uuidv4();
					readerRef.current = response.body!.getReader();
					const decoder = new TextDecoder();

					while (true) {
						dispatch({
							type: ACTION_STREAMING,
							payload: {
								streaming: true,
							},
						});
						const { done, value } = await readerRef.current.read();
						if (done) {
							// stream completed
							dispatch({
								type: ACTION_STREAMING,
								payload: {
									streaming: false,
								},
							});
							break;
						}

						// decode the value from the chunk
						const chunk = decoder.decode(value, { stream: true });

						/**
						 * If the chunk contains ==stats==, it means the response is complete.
						 * We need to remove ==stats== from the chunk and extract the string
						 * before as a normal chunk and JSON.parse the rest which contains the
						 * following stats: processingTime, model and usage.
						 */
						const statsIndex = chunk.indexOf(STATS_SEPARATOR);
						if (statsIndex !== -1) {
							const content = chunk.substring(0, statsIndex);
							const stats = JSON.parse(
								chunk.substring(statsIndex + STATS_SEPARATOR.length),
							);
							dispatch({
								type: ACTION_MODEL,
								payload: {
									model: stats.model,
									usage: stats.usage,
								},
							});
							dispatch({
								type: ACTION_MESSAGE,
								payload: {
									message: {
										content,
										role: ROLE_ASSISTANT,
										messageId,
										processingTime: stats.processingTime,
										name: stats.name,
									},
								},
							});
							dispatch({
								type: ACTION_STREAMING,
								payload: {
									streaming: false,
								},
							});
							break;
						} else {
							dispatch({
								type: ACTION_MESSAGE,
								payload: {
									message: {
										content: chunk,
										role: ROLE_ASSISTANT,
										messageId,
									},
								},
							});
						}
					}
				}
			} catch (error) {
				console.error(error);
				dispatch({
					type: ACTION_STREAMING,
					payload: {
						streaming: false,
					},
				});
				dispatch({
					type: ACTION_MESSAGE,
					payload: {
						message: {
							role: ROLE_INTERNAL,
							content: ERROR_MESSAGE,
						},
					},
				});
			}
		})();
		/**
		 * The dependency array is limited to state.messages because
		 * we only want to call the OpenAI API when a new message
		 * is added to the state.
		 * All other dependencies such as dispatch, isModel4, state,
		 * and user.email should be ignored -> if they change, we do
		 * not want to call the OpenAI API again.
		 */
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.messages]);

	/**
	 * On submit, we dispatch the message to the state. The state
	 * is keeping track of the whole conversation and must be
	 * used to generate the next response. That's why the call
	 * to OpenAI can only be done after the message is dispatched,
	 * in the useEffect hook above.
	 */
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch({
			type: ACTION_MESSAGE,
			payload: {
				message: {
					role: ROLE_USER,
					content: userInput,
				},
			},
		});
		// Clear the input field
		setUserInput("");
	};

	/**
	 * Focus on the input field when the chat is not streaming,
	 * but only if it was not manually focused before.
	 */
	useEffect(() => {
		if (
			state?.streaming === false &&
			!inputFocusedRef.current &&
			inputRef.current
		) {
			inputFocusedRef.current = true;
			inputRef.current.focus();
		}

		if (state?.streaming === true && inputFocusedRef.current === true) {
			inputFocusedRef.current = false;
		}
	}, [state]);

	return !isAuthenticated && isProd ? (
		<Button
			mode="dark"
			focusMode="light"
			noBorder
			className="mb-4 mt-6"
			onClick={() => loginWithRedirect()}
		>
			{LOG_IN}
		</Button>
	) : (
		<form className="mt-2" onSubmit={onSubmit}>
			<TextArea
				mode="dark"
				focusMode="light"
				ref={inputRef}
				name="chat-input"
				label={TYPE_QUESTION}
				helperText={"Press ENTER to add a new line"}
				helperTextOnFocus
				required
				value={userInput}
				onChange={(e) => setUserInput(e.target.value)}
				rightElement={
					<Button
						disabled={state?.streaming}
						noBorder
						type="submit"
						mode="light"
						focusMode="light"
					>
						{SEND}
					</Button>
				}
			/>
		</form>
	);
};
