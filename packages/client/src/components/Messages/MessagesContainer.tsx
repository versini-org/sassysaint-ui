import { useEffect, useReducer, useRef } from "react";

import {
	ERROR_MESSAGE,
	ROLE_ASSISTANT,
	ROLE_INTERNAL,
	ROLE_USER,
} from "../../common/constants";
import { MessageAssistant, MessagesContainerHeader, MessageUser } from "../";
import { PromptInput } from "../PromptInput/PromptInput";
import { Spinner } from "../Spinner/Spinner";
import { MessagesContext } from "./MessagesContext";

export type MessagesContainerProps = {
	noHeader?: boolean;
};

export type actionProps = {
	role: string;
	content: string;
};

/**
 * When a new message is created either by the user or by the AI,
 * the reducer will be called and the new message will be added
 * to the state.
 */
const reducer = (state: actionProps[], action: actionProps) => {
	switch (action.role) {
		case ROLE_USER:
		case ROLE_ASSISTANT:
		case ROLE_INTERNAL:
			return [...state, { role: action.role, content: action.content }];
		default:
			return [...state, { role: ROLE_INTERNAL, content: ERROR_MESSAGE }];
	}
};

export const MessagesContainer = ({
	noHeader = false,
}: MessagesContainerProps) => {
	const inputRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
	const smoothScrollRef: React.RefObject<HTMLDivElement> = useRef(null);
	const spinnerRef: React.RefObject<HTMLDivElement> = useRef(null);
	const [state, dispatch] = useReducer(reducer, []);

	/**
	 * Scroll to the bottom of the messages container when
	 * a new message is added and move the focus on the input
	 * field.
	 */
	useEffect(() => {
		if (!state || state.length === 0) {
			return;
		}
		const lastMessage = state[state.length - 1];

		/**
		 * if the last message is from the user, scroll
		 * to the spinner
		 */
		if (spinnerRef.current && lastMessage.role !== ROLE_ASSISTANT) {
			spinnerRef.current.scrollIntoView({ behavior: "smooth" });
		}

		/**
		 * if the last message is from the assistant, scroll
		 * to the top of the messages container.
		 */
		if (
			smoothScrollRef &&
			smoothScrollRef.current &&
			lastMessage.role === ROLE_ASSISTANT
		) {
			smoothScrollRef.current.scrollIntoView({
				block: "start",
				inline: "nearest",
				behavior: "smooth",
			});
		}
	}, [state]);

	return (
		<>
			<MessagesContext.Provider value={{ state, dispatch }}>
				<div className="flex-1 space-y-6 overflow-y-auto rounded-md p-4 text-base leading-6 shadow-sm bg-slate-900 text-slate-300 sm:text-base sm:leading-7">
					{!noHeader && <MessagesContainerHeader />}

					{state &&
						state.map((message, index) => {
							const { role, content } = message;
							if (
								(role === ROLE_ASSISTANT || role === ROLE_INTERNAL) &&
								content
							) {
								return (
									<MessageAssistant
										key={`${index}-${role}`}
										smoothScrollRef={smoothScrollRef}
									>
										{content}
									</MessageAssistant>
								);
							}
							if (role === ROLE_USER && content) {
								return (
									<MessageUser key={`${index}-${role}`}>{content}</MessageUser>
								);
							}
							return null;
						})}

					{state &&
						state.length > 0 &&
						state[state.length - 1].role === ROLE_USER && (
							<Spinner spinnerRef={spinnerRef} />
						)}
				</div>

				<PromptInput inputRef={inputRef} />
			</MessagesContext.Provider>
		</>
	);
};
