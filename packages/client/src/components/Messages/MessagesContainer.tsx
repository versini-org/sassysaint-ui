import { ROLE_ASSISTANT, ROLE_USER } from "../../common/constants";
import { useEffect, useRef, useState } from "react";

import { MessageAssistant } from "./MessageAssistant";
import { MessageUser } from "./MessageUser";
import { MessagesContainerHeader } from "./MessagesContainerHeader";
import { PromptInput } from "../PromptInput/PromptInput";
import { Spinner } from "../Spinner/Spinner";

export type MessagesContainerProps = {
	noHeader?: boolean;
};

export const MessagesContainer = ({
	noHeader = false,
}: MessagesContainerProps) => {
	const inputRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
	const [messages, setMessages] = useState([
		{
			role: "",
			content: "",
		},
	]);
	/**
	 * Scroll to the bottom of the messages container when
	 * a new message is added and move the focus on the input
	 * field.
	 */
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.scrollIntoView({ behavior: "smooth" });
			inputRef.current.focus();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages]);

	return (
		<>
			<div className="flex-1 space-y-6 overflow-y-auto rounded-md p-4 text-base leading-6 shadow-sm bg-slate-900 text-slate-300 sm:text-base sm:leading-7">
				{!noHeader && <MessagesContainerHeader />}

				{messages &&
					messages.map((message, index) => {
						const { role, content } = message;
						if (role === ROLE_ASSISTANT && content) {
							return (
								<MessageAssistant key={`${index}-${role}`}>
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

				{messages.length > 0 &&
					messages[messages.length - 1].role === ROLE_USER && <Spinner />}
			</div>

			<PromptInput
				inputRef={inputRef}
				onUserSubmit={({ role, content }) => {
					setMessages((prev) => [...prev, { role, content }]);
				}}
				onAiResponse={({ role, content }) => {
					setMessages((prev) => [...prev, { role, content }]);
				}}
			/>
		</>
	);
};
