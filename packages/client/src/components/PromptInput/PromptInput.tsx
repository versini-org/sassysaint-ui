import {
	ROLE_ASSISTANT,
	ROLE_INTERNAL,
	ROLE_SYSTEM,
	ROLE_USER,
} from "../../common/constants";
import React, { useEffect, useLayoutEffect, useState } from "react";

const ERROR_MESSAGE = "I'm having trouble right now. Please try again later.";

export type onPromptInputSubmitProps = {
	role: string;
	content: string;
};
export type PromptInputProps = {
	onUserSubmit: (props: onPromptInputSubmitProps) => void;
	onAiResponse: (props: onPromptInputSubmitProps) => void;
	inputRef: React.RefObject<HTMLTextAreaElement>;
};

export const PromptInput = ({
	onUserSubmit,
	onAiResponse,
	inputRef,
}: PromptInputProps) => {
	const [userInput, setUserInput] = useState("");
	const [messages, setMessages] = useState<onPromptInputSubmitProps[]>([]);

	useEffect(() => {
		(async () => {
			const lastMessage = messages[messages.length - 1];
			if (
				messages.length === 0 ||
				lastMessage.role === ROLE_ASSISTANT ||
				lastMessage.role === ROLE_SYSTEM ||
				lastMessage.role === ROLE_INTERNAL
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
						body: JSON.stringify({ messages }),
					},
				);
				const data = await response.json();
				onAiResponse({
					role: ROLE_ASSISTANT,
					content: data.result,
				});
				setMessages((prev) => [
					...prev,
					{ role: ROLE_ASSISTANT, content: data.result },
				]);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
				onAiResponse({
					role: ROLE_ASSISTANT,
					content: ERROR_MESSAGE,
				});
				setMessages((prev) => [
					...prev,
					{ role: ROLE_INTERNAL, content: ERROR_MESSAGE },
				]);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages]);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// save the user input to the messages state
		setMessages((prev) => [...prev, { role: ROLE_USER, content: userInput }]);
		// update the UI with the user input
		onUserSubmit({
			role: ROLE_USER,
			content: userInput,
		});
	};

	useLayoutEffect(() => {
		if (inputRef && inputRef.current) {
			inputRef.current.style.height = "inherit";
			inputRef.current.style.height = inputRef.current.scrollHeight + "px";
		}
	}, [inputRef, userInput]);

	return (
		<>
			<form className="mt-2" onSubmit={onSubmit}>
				<label htmlFor="chat-input" className="sr-only">
					Enter your question
				</label>

				<div className="relative">
					<textarea
						ref={inputRef}
						id="chat-input"
						// onInput={onInput}
						className="block w-full resize-none rounded-md border-none p-4 pr-24 text-base caret-slate-100 focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-slate-300 bg-slate-900 text-slate-200 placeholder-slate-400 sm:text-base"
						rows={1}
						placeholder="Enter your question"
						required
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
					/>

					<button
						type="submit"
						className="absolute bottom-2 right-2.5 rounded-full  px-4 py-2 text-sm font-medium text-slate-200 bg-slate-500 hover:bg-blue-900 focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-slate-300 sm:text-base"
					>
						Send <span className="sr-only">Send message</span>
					</button>
				</div>
			</form>
		</>
	);
};
