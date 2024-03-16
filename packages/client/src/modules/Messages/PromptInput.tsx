import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@versini/ui-components";
import { TextArea } from "@versini/ui-form";
import { useLocalStorage } from "@versini/ui-hooks";
import React, { useContext, useEffect, useRef, useState } from "react";

import {
	ACTION_MESSAGE,
	ACTION_MODEL,
	ERROR_MESSAGE,
	LOCAL_STORAGE_MODEL,
	LOCAL_STORAGE_PREFIX,
	MODEL_GPT3,
	MODEL_GPT4,
	ROLE_ASSISTANT,
	ROLE_HIDDEN,
	ROLE_INTERNAL,
	ROLE_SYSTEM,
	ROLE_USER,
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
	const [isModel4] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_MODEL,
		defaultValue: false,
	});

	const inputRef: React.RefObject<HTMLTextAreaElement> = useRef(null);

	useEffect(() => {
		(async () => {
			if (!state || state.messages.length === 0) {
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
						model: isModel4 ? MODEL_GPT4 : MODEL_GPT3,
						user: user?.email || FAKE_USER_EMAIL,
						id: state.id,
						location: state.location,
					},
				});

				if (response.status !== 200) {
					dispatch({
						type: ACTION_MESSAGE,
						payload: {
							message: {
								role: ROLE_INTERNAL,
								content: ERROR_MESSAGE,
							},
						},
					});
				} else {
					const data = await response.json();
					dispatch({
						type: ACTION_MODEL,
						payload: {
							usage: data.usage,
							model: data.model,
						},
					});
					dispatch({
						type: ACTION_MESSAGE,
						payload: {
							message: {
								role: ROLE_ASSISTANT,
								content: data.result,
								name: data.name,
								processingTime: data.processingTime,
							},
						},
					});
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
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
		// And focus on it again
		inputRef?.current?.focus();
	};

	return !isAuthenticated && isProd ? (
		<Button noBorder className="mb-4 mt-6" onClick={() => loginWithRedirect()}>
			{LOG_IN}
		</Button>
	) : (
		<form className="mt-2" onSubmit={onSubmit}>
			<label htmlFor="chat-input" className="sr-only">
				{TYPE_QUESTION}
			</label>

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
					<Button noBorder type="submit" mode="light" focusMode="light">
						{SEND}
					</Button>
				}
			/>
		</form>
	);
};
