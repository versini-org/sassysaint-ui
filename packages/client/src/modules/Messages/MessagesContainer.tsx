import { useAuth0 } from "@auth0/auth0-react";
import clsx from "clsx";

import { isDev } from "../../common/utilities";
import { Toolbox } from "../Toolbox/Toolbox";
import { MessagesContainerHeader } from "./MessagesContainerHeader";
import { MessagesList } from "./MessagesList";
import { PromptInput } from "./PromptInput";

export const MessagesContainer = () => {
	const { isAuthenticated } = useAuth0();
	const paddingTop = isAuthenticated || isDev ? "pt-4" : "pt-10";
	const containerClass = clsx(
		"flex-1 space-y-6 overflow-y-auto rounded-md bg-slate-900 px-4 pb-10 text-base leading-6 text-slate-300 shadow-sm sm:text-base sm:leading-7",
		paddingTop,
	);

	return (
		<>
			<div className={containerClass}>
				<MessagesContainerHeader />
				<MessagesList />
			</div>

			<Toolbox />
			<PromptInput />
		</>
	);
};
