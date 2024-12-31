import { useAuth } from "@versini/auth-provider";
import { Button, ButtonIcon } from "@versini/ui-button";
import { getHotkeyHandler } from "@versini/ui-hooks";
import { TextArea } from "@versini/ui-textarea";
import React, { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { IconAdd, IconClose } from "@versini/ui-icons";
import {
	ACTION_MESSAGE,
	ACTION_MODEL,
	ACTION_RESET,
	ACTION_RESET_TAGS,
	ACTION_STREAMING,
	DEFAULT_AI_ENGINE,
	ERROR_MESSAGE,
	ROLE_ASSISTANT,
	ROLE_HIDDEN,
	ROLE_INTERNAL,
	ROLE_SYSTEM,
	ROLE_USER,
	STATS_SEPARATOR,
} from "../../common/constants";
import { restCall } from "../../common/services";
import { CLIPBOARD_TAG, SEND, TYPE_QUESTION } from "../../common/strings";
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

	const buttonRef = useRef<HTMLButtonElement>(null);
	const buttonFocusedRef = useRef(false);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
		null,
	);

	/**
	 * Focus the clear button when the chat is streaming,
	 * but only if it was not manually focused before.
	 */
	useEffect(() => {
		if (
			state?.streaming === true &&
			!buttonFocusedRef.current &&
			buttonRef.current
		) {
			buttonFocusedRef.current = true;
			buttonRef.current.focus();
		}

		if (state?.streaming === false) {
			buttonFocusedRef.current = false;
			buttonRef.current?.blur();
		}
	}, [state]);

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
						model: state.engine || DEFAULT_AI_ENGINE,
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

	const toolboxPrimaryAction = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch({
			type: ACTION_RESET,
		});
	};

	/**
	 * If the user clicks on a tag, the content of the tag is placed in the
	 * input field, the input field gets the focus, and we reset the tag
	 * toggle status.
	 */
	useEffect(() => {
		if (tagsState.tag !== "") {
			/**
			 * If the tag ends with a colon but does not ends with a space,
			 * we add a space at the end.
			 */
			const newTag =
				tagsState.tag.endsWith(":") && !tagsState.tag.endsWith(": ")
					? tagsState.tag + " "
					: tagsState.tag;

			/**
			 * If the tag contains the string <clipboard>, replace this string with the
			 * current content of the clipboard, or an empty string if the
			 * clipboard is empty.
			 */
			const clipboardIndex = newTag.indexOf(CLIPBOARD_TAG);
			if (clipboardIndex !== -1) {
				navigator.clipboard.readText().then((clipboard) => {
					setUserInput(newTag.replace(CLIPBOARD_TAG, clipboard));
				});
			} else {
				setUserInput(newTag);
			}

			inputRef.current && inputRef.current.focus();
			tagsDispatch({
				type: ACTION_RESET_TAGS,
			});
		}
	}, [tagsState, tagsDispatch]);

	/**
	 * If the chat is reset, we focus the input field.
	 */
	useEffect(() => {
		if (state && state.usage === 0 && state.messages.length === 0) {
			inputRef.current && inputRef.current.focus();
		}
	}, [state]);

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
				onKeyDown={getHotkeyHandler([["mod+Enter", onSubmit]])}
				leftElement={
					<ButtonIcon
						radius="small"
						noBorder
						mode="light"
						focusMode="light"
						ref={buttonRef}
						onClick={toolboxPrimaryAction}
					>
						{state?.streaming ? (
							<IconClose size="size-4" />
						) : (
							<IconAdd size="size-4" />
						)}
					</ButtonIcon>
				}
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
