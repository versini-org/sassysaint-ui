import { useAuth } from "@versini/auth-provider";
import { Button } from "@versini/ui-components";
import { TextArea } from "@versini/ui-form";
import React, { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
	ACTION_MESSAGE,
	ACTION_MODEL,
	ACTION_RESET_TAGS,
	ACTION_STREAMING,
	ERROR_MESSAGE,
	MODEL_GPT4,
	ROLE_ASSISTANT,
	ROLE_HIDDEN,
	ROLE_INTERNAL,
	ROLE_SYSTEM,
	ROLE_USER,
	STATS_SEPARATOR,
	TAG_CONTENT,
} from "../../common/constants";
import { restCall } from "../../common/services";
import { SEND, TYPE_QUESTION } from "../../common/strings";
import { AppContext, TagsContext } from "../App/AppContext";

const dispatchStreaming = (dispatch: any, streaming: boolean) => {
	dispatch({
		type: ACTION_STREAMING,
		payload: {
			streaming: streaming,
		},
	});
};
const dispatchError = (dispatch: any) => {
	dispatchStreaming(dispatch, false);
	dispatch({
		type: ACTION_MESSAGE,
		payload: {
			message: {
				role: ROLE_INTERNAL,
				content: ERROR_MESSAGE,
			},
		},
	});
};

export type onPromptInputSubmitProps = {
	message: {
		content: string;
		role: string;
	};
};

export const PromptInput = () => {
	const { state, dispatch } = useContext(AppContext);
	const { state: tagsState, dispatch: tagsDispatch } = useContext(TagsContext);
	const [userInput, setUserInput] = useState("");
	const { getAccessToken, user } = useAuth();

	const inputFocusedRef = useRef(false);
	const inputRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
	const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
		null,
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: see below
	useEffect(() => {
		(async () => {
			/**
			 * Cancel the reader stream if there are no messages (e.g. on chat reset)
			 */
			if (!state || state.messages.length === 0) {
				readerRef?.current?.cancel();
				return;
			}

			/**
			 * If the last message is not from the user, we simply ignore it.
			 */
			const lastMessage = state.messages[state.messages.length - 1];
			if (
				state.messages.length === 0 ||
				lastMessage.message.role === ROLE_ASSISTANT ||
				lastMessage.message.role === ROLE_SYSTEM ||
				lastMessage.message.role === ROLE_INTERNAL ||
				lastMessage.message.role === ROLE_HIDDEN
			) {
				return;
			}

			/**
			 * If we are here it means that the last message is from the user
			 * and we can call the OpenAI API to generate a response.
			 */
			try {
				const response = await restCall({
					accessToken: await getAccessToken(),
					name: "generate",
					data: {
						messages: state.messages,
						model: MODEL_GPT4,
						user: user?.username || "",
						id: state.id,
						usage: state.usage,
					},
				});

				if (response && response.ok) {
					const messageId = uuidv4();
					readerRef.current = response.body!.getReader();
					const decoder = new TextDecoder();

					while (true) {
						dispatchStreaming(dispatch, true);

						const { done, value } = await readerRef.current.read();
						if (done) {
							// stream completed
							dispatchStreaming(dispatch, false);
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
							dispatchStreaming(dispatch, false);
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
				} else {
					dispatchError(dispatch);
				}
			} catch (error) {
				console.error(error);
				dispatchError(dispatch);
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

	useEffect(() => {
		if (tagsState.tag !== "" && TAG_CONTENT[tagsState.tag]) {
			setUserInput(TAG_CONTENT[tagsState.tag].content);
			inputRef.current && inputRef.current.focus();
			tagsDispatch({
				type: ACTION_RESET_TAGS,
			});
		}
	}, [tagsState, tagsDispatch]);

	return (
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
