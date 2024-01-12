import { useAuth0 } from "@auth0/auth0-react";
import { Panel } from "@versini/ui-components";

import { HISTORY_TITLE } from "../../common/strings";
import { isDev } from "../../common/utilities";
import { HistoryContent } from "./HistoryContent";

export const History = ({
	open,
	onOpenChange,
	historyData,
}: {
	historyData: any[];
	onOpenChange: any;
	open: boolean;
}) => {
	const { isAuthenticated, user } = useAuth0();

	return (
		<Panel open={open} onOpenChange={onOpenChange} title={HISTORY_TITLE}>
			<HistoryContent
				isAuthenticated={isAuthenticated}
				isDev={isDev}
				user={user}
				onOpenChange={onOpenChange}
				historyData={historyData}
			/>
		</Panel>
	);
};
