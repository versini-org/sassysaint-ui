import { IconDog } from "../Icons";
import { Message } from "./Message";
import { ROLE_USER } from "../../common/constants";
import { Spinner } from "../Spinner/Spinner";
import type { onPromptInputSubmitProps } from "../PromptInput/PromptInput";
import { useEffect } from "react";

export type MessagesContainerProps = {
	children?: React.ReactNode;
	noHeader?: boolean;
	messages: onPromptInputSubmitProps[];
	inputRef: React.RefObject<HTMLTextAreaElement>;
};

const MessagesContainerHeader = () => {
	return (
		<div className="flex items-center justify-center">
			<div className="basis-1/4">
				<IconDog />
			</div>
			<div>
				<h1 className="text-2xl font-bold text-slate-300">Sassy Saint</h1>
				<h2 className="text-slate-300">ASK! ME! ANYTHING!</h2>
			</div>
		</div>
	);
};

export const MessagesContainer = ({
	noHeader = false,
	messages = [],
	inputRef,
}: MessagesContainerProps) => {
	useEffect(() => {
		if (inputRef.current) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			inputRef.current.scrollIntoView({ behavior: "smooth" });
			inputRef.current.focus();
			inputRef.current.value = "";
			inputRef.current.style.height = "auto";
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages]);

	return (
		<div className="flex-1 space-y-6 overflow-y-auto rounded-md p-4 text-base leading-6 shadow-sm bg-slate-900 text-slate-300 sm:text-base sm:leading-7">
			{!noHeader && <MessagesContainerHeader />}

			{messages &&
				messages.map((message, index) => {
					const { role, content } = message;
					return role && content ? (
						<Message key={`${index}-${role}`} type={role}>
							{content}
						</Message>
					) : null;
				})}

			{messages.length > 0 &&
				messages[messages.length - 1].role === ROLE_USER && <Spinner />}
		</div>
	);
};
