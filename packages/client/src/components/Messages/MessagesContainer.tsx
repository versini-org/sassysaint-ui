import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useReducer, useRef } from "react";

import {
	DEFAULT_MODEL,
	ERROR_MESSAGE,
	ROLE_ASSISTANT,
	ROLE_HIDDEN,
	ROLE_INTERNAL,
	ROLE_RESET,
	ROLE_USER,
} from "../../common/constants";
import { isDev, retrieveModel } from "../../common/utilities";
import {
	MessageAssistant,
	MessagesContainerHeader,
	MessageUser,
	Toolbox,
} from "../";
import { PromptInput } from "../PromptInput/PromptInput";
import { Spinner } from "../Spinner/Spinner";
import type { actionProps, MessagesContainerProps } from "./Messages";
import { MessagesContext } from "./MessagesContext";

/**
 * When a new message is created either by the user or by the AI,
 * the reducer will be called and the new message will be added
 * to the state.
 */
const reducer = (state: actionProps[], action: actionProps) => {
	switch (action.message.role) {
		case ROLE_USER:
		case ROLE_ASSISTANT:
		case ROLE_INTERNAL:
			return [
				...state,
				{
					message: {
						role: action.message.role,
						content: action.message.content,
					},
					usage: action.usage,
					model: action.model,
				},
			];
		case ROLE_HIDDEN:
			return [
				...state,
				{
					message: {
						role: action.message.role,
						content: action.message.content,
					},
					usage: action.usage,
					model: action.model,
				},
			];
		case ROLE_RESET:
			return [];
		default:
			return [
				...state,
				{
					message: {
						role: ROLE_INTERNAL,
						content: ERROR_MESSAGE,
					},
					usage: 0,
					model: "N/A",
				},
			];
	}
};

export const MessagesContainer = ({
	noHeader = false,
}: MessagesContainerProps) => {
	const inputRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
	const smoothScrollRef: React.RefObject<HTMLDivElement> = useRef(null);
	const spinnerRef: React.RefObject<HTMLDivElement> = useRef(null);

	const model = retrieveModel() || DEFAULT_MODEL;

	const [state, dispatch] = useReducer(reducer, [
		{
			message: {
				role: ROLE_HIDDEN,
				content: model,
			},
			model,
			usage: 0,
		},
	]);
	const { isAuthenticated } = useAuth0();
	const paddingTop = isAuthenticated || isDev ? "pt-4" : "pt-10";

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
		if (spinnerRef.current && lastMessage.message.role !== ROLE_ASSISTANT) {
			spinnerRef.current.scrollIntoView({ behavior: "smooth" });
		}

		/**
		 * if the last message is from the assistant, scroll
		 * to the top of the messages container.
		 */
		if (
			smoothScrollRef &&
			smoothScrollRef.current &&
			lastMessage.message.role === ROLE_ASSISTANT
		) {
			smoothScrollRef.current.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [state]);

	return (
		<>
			<MessagesContext.Provider value={{ state, dispatch }}>
				<div
					className={`flex-1 space-y-6 overflow-y-auto rounded-md px-4 ${paddingTop} pb-10 text-base leading-6 shadow-sm bg-slate-900 text-slate-300 sm:text-base sm:leading-7`}
				>
					{!noHeader && <MessagesContainerHeader />}

					{state &&
						state.map((data, index) => {
							const { role, content } = data.message;
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
						state[state.length - 1].message.role === ROLE_USER && (
							<Spinner spinnerRef={spinnerRef} />
						)}
				</div>

				{state &&
					state.length > 0 &&
					state[state.length - 1].message.role === ROLE_ASSISTANT && (
						<Toolbox className="mt-2" />
					)}

				<PromptInput inputRef={inputRef} />
			</MessagesContext.Provider>
		</>
	);
};
