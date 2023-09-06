import { useAuth0 } from "@auth0/auth0-react";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";

import {
	ERROR_MESSAGE,
	ROLE_ASSISTANT,
	ROLE_HIDDEN,
	ROLE_INTERNAL,
	ROLE_SYSTEM,
	ROLE_USER,
} from "../../common/constants";
import { isProd } from "../../common/utilities";
import { Button } from "..";
import { MessagesContext } from "../Messages/MessagesContext";

export type onPromptInputSubmitProps = {
	message: {
		role: string;
		content: string;
	};
};
export type PromptInputProps = {
	inputRef: React.RefObject<HTMLTextAreaElement>;
};

export const PromptInput = ({ inputRef }: PromptInputProps) => {
	/**
	 * Save all messages to the state in order to keep track of
	 * the whole conversation. This is needed so that the
	 * gpt engine can generate a response based on context.
	 */
	const { state, dispatch } = useContext(MessagesContext);
	const [userInput, setUserInput] = useState("");
	const { loginWithRedirect, isAuthenticated } = useAuth0();

	useEffect(() => {
		(async () => {
			if (!state || state.length === 0) {
				return;
			}
			const lastMessage = state[state.length - 1];
			if (
				state.length === 0 ||
				lastMessage.message.role === ROLE_ASSISTANT ||
				lastMessage.message.role === ROLE_SYSTEM ||
				lastMessage.message.role === ROLE_INTERNAL ||
				lastMessage.message.role === ROLE_HIDDEN
			) {
				return;
			}

			try {
				const response = await fetch(
					`${import.meta.env.VITE_SERVER_URL}/api/generate`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ messages: state }),
					},
				);

				if (response.status !== 200) {
					dispatch({
						message: {
							role: ROLE_INTERNAL,
							content: ERROR_MESSAGE,
						},
					});
				} else {
					const data = await response.json();
					dispatch({
						message: {
							role: ROLE_ASSISTANT,
							content: data.result,
						},
						usage: data.usage,
						model: data.model,
					});
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
				dispatch({
					message: {
						role: ROLE_INTERNAL,
						content: ERROR_MESSAGE,
					},
				});
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch({
			message: {
				role: ROLE_USER,
				content: userInput,
			},
		});
		// Clear the input field
		setUserInput("");
		// And focus on it again
		inputRef?.current?.focus();
	};

	/**
	 * This effect is used to resize the textarea based
	 * on the content, so that the user can see all the
	 * content they have typed.
	 */
	useLayoutEffect(() => {
		if (inputRef && inputRef.current) {
			inputRef.current.style.height = "inherit";
			inputRef.current.style.height = inputRef.current.scrollHeight + "px";
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userInput]);

	return !isAuthenticated && isProd ? (
		<>
			<Button className="mt-6 mb-4" onClick={() => loginWithRedirect()}>
				Log in
			</Button>
		</>
	) : (
		<>
			<form className="mt-2" onSubmit={onSubmit}>
				<label htmlFor="chat-input" className="sr-only">
					Enter your question
				</label>

				<div className="relative">
					<textarea
						ref={inputRef}
						id="chat-input"
						className="block w-full resize-none rounded-md border-none p-4 pr-24 min-h-[56px] text-base caret-slate-100 focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-slate-300 bg-slate-900 text-slate-200 placeholder-slate-400 sm:text-base"
						rows={1}
						placeholder="Enter your question"
						required
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
					/>

					<Button
						kind="light"
						type="submit"
						className="absolute bottom-2 right-2.5"
					>
						Send
					</Button>
				</div>
			</form>
		</>
	);
};
