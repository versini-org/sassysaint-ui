import { useAuth0 } from "@auth0/auth0-react";

import { getMessageContaintWrapperClass } from "../../common/utilities";
import { Toolbox } from "../Toolbox/Toolbox";
import { MessagesContainerHeader } from "./MessagesContainerHeader";
import { MessagesList } from "./MessagesList";
import { PromptInput } from "./PromptInput";

export const MessagesContainer = () => {
	const { isAuthenticated } = useAuth0();
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
