import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useEffect, useRef } from "react";

import {
	ROLE_ASSISTANT,
	ROLE_INTERNAL,
	ROLE_USER,
} from "../../common/constants";
import { isDev } from "../../common/utilities";
import { Spinner } from "../../components";
import { AppContext } from "../App/AppContext";
import { Toolbox } from "../Toolbox/Toolbox";
import { MessageAssistant } from "./MessageAssistant";
import type { MessagesContainerProps } from "./Messages";
import { MessagesContainerHeader } from "./MessagesContainerHeader";
import { MessageUser } from "./MessageUser";
import { PromptInput } from "./PromptInput";

export const MessagesContainer = ({
	noHeader = false,
}: MessagesContainerProps) => {
	const inputRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
	const smoothScrollRef: React.RefObject<HTMLDivElement> = useRef(null);
	const spinnerRef: React.RefObject<HTMLDivElement> = useRef(null);

	const { isAuthenticated } = useAuth0();
	const paddingTop = isAuthenticated || isDev ? "pt-4" : "pt-10";
	const { state } = useContext(AppContext);

	/**
	 * Scroll to the bottom of the messages container when
	 * a new message is added and move the focus on the input
	 * field.
	 */
	useEffect(() => {
		if (!state || state.messages.length === 0) {
			return;
		}
		const lastMessage = state.messages[state.messages.length - 1];

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
			<div
				className={`flex-1 space-y-6 overflow-y-auto rounded-md px-4 ${paddingTop} pb-10 text-base leading-6 shadow-sm bg-slate-900 text-slate-300 sm:text-base sm:leading-7`}
			>
				{!noHeader && <MessagesContainerHeader />}

				{state &&
					state.messages.length > 0 &&
					state.messages.map((data, index) => {
						const { role, content, name } = data.message;
						if (
							(role === ROLE_ASSISTANT || role === ROLE_INTERNAL) &&
							content
						) {
							return (
								<MessageAssistant
									key={`${index}-${role}`}
									smoothScrollRef={smoothScrollRef}
									name={name}
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
					state.messages.length > 0 &&
					state.messages[state.messages.length - 1].message.role ===
						ROLE_USER && <Spinner spinnerRef={spinnerRef} />}
			</div>

			{state &&
				state.messages.length > 0 &&
				state.messages[state.messages.length - 1].message.role ===
					ROLE_ASSISTANT && <Toolbox className="mt-2" />}

			<PromptInput inputRef={inputRef} />
		</>
	);
};
