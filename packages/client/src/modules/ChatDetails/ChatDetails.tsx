import { useAuth0 } from "@auth0/auth0-react";
import { Panel } from "@versini/ui-components";

import { STATS } from "../../common/strings";
import { ChatDetailsContent } from "./ChatDetailsContent";

export const ChatDetails = ({
	open,
	onOpenChange,
	historyData,
}: {
	open: boolean;
	onOpenChange: any;
	historyData: any[];
}) => {
	const { isAuthenticated, user } = useAuth0();

	return (
		<Panel open={open} onOpenChange={onOpenChange} title={STATS}>
			<ChatDetailsContent
				user={user}
				isAuthenticated={isAuthenticated}
				historyData={historyData}
			/>
		</Panel>
	);
};
