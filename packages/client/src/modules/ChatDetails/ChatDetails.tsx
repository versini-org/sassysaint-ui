import { useAuth0 } from "@auth0/auth0-react";
import { Panel } from "@versini/ui-components";
import { useEffect, useState } from "react";

import { GRAPHQL_QUERIES, graphQLCall } from "../../common/services";
import { FAKE_USER_EMAIL, STATS } from "../../common/strings";
import { ChatDetailsContent } from "./ChatDetailsContent";

export const ChatDetails = ({
	open,
	onOpenChange,
}: {
	onOpenChange: any;
	open: boolean;
}) => {
	const [stats, setStats] = useState<{
		averageProcessingTimes: number;
		totalChats: number;
	}>({
		averageProcessingTimes: 0,
		totalChats: 0,
	});
	const { isAuthenticated, user } = useAuth0();

	useEffect(() => {
		if (!open) {
			/**
			 * Menu is closed, no pre-fetching
			 */
			return;
		}
		(async () => {
			try {
				const response = await graphQLCall({
					query: GRAPHQL_QUERIES.GET_CHATS_STATS,
					data: {
						userId: user?.email || FAKE_USER_EMAIL,
					},
				});

				if (response.status === 200) {
					const data = await response.json();
					setStats(data.data.chatsStats);
				}
			} catch (_error) {
				// nothing to declare officer
			}
		})();
	}, [open, user?.email]);

	return (
		<Panel open={open} onOpenChange={onOpenChange} title={STATS}>
			<ChatDetailsContent
				user={user}
				isAuthenticated={isAuthenticated}
				stats={stats}
			/>
		</Panel>
	);
};
