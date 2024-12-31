import { useAuth } from "@versini/auth-provider";

import { getMessageContaintWrapperClass } from "../../common/utilities";
import { MessagesContainerHeader } from "./MessagesContainerHeader";
import { MessagesList } from "./MessagesList";

export const MessagesContainer = () => {
	const { isAuthenticated } = useAuth();
	const containerClass = getMessageContaintWrapperClass(isAuthenticated);

	return (
		<>
			<div className={containerClass}>
				<MessagesContainerHeader />
				<MessagesList />
			</div>
		</>
	);
};
