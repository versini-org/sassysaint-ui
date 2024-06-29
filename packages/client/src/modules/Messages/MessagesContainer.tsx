import { useAuth } from "@versini/auth-provider";

import { getMessageContaintWrapperClass } from "../../common/utilities";
import { Toolbox } from "../Toolbox/Toolbox";
import { MessagesContainerHeader } from "./MessagesContainerHeader";
import { MessagesList } from "./MessagesList";
import { PromptInput } from "./PromptInput";

export const MessagesContainer = () => {
	const { isAuthenticated } = useAuth();
	const containerClass = getMessageContaintWrapperClass(isAuthenticated);

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
