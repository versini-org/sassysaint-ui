import { CHAT_DETAILS_TITLE } from "../../common/strings";
import { ChatDetailsContent } from "./ChatDetailsContent";
import { Panel } from "../../components";
import { isDev } from "../../common/utilities";
import { useAuth0 } from "@auth0/auth0-react";

export const ChatDetails = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: any;
}) => {
	const { isAuthenticated } = useAuth0();

	return (
		<Panel open={open} onOpenChange={onOpenChange} title={CHAT_DETAILS_TITLE}>
			<ChatDetailsContent isAuthenticated={isAuthenticated} isDev={isDev} />
		</Panel>
	);
};
