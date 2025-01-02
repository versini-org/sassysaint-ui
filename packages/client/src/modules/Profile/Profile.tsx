import { Panel } from "@versini/ui-panel";

import { useAuth } from "@versini/auth-provider";
import { useEffect, useState } from "react";
import { SERVICE_TYPES, serviceCall } from "../../common/services";
import { PROFILE_TITLE } from "../../common/strings";
import { ProfileContent } from "./ProfileContent";

export const Profile = ({
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
	const { getAccessToken, user } = useAuth();

	useEffect(() => {
		if (!open || !user) {
			/**
			 * Menu is closed, no pre-fetching
			 */
			return;
		}
		(async () => {
			try {
				const response = await serviceCall({
					accessToken: await getAccessToken(),
					type: SERVICE_TYPES.GET_CHATS_STATS,
					params: {
						userId: user.username,
					},
				});

				if (response.status === 200) {
					setStats(response.data);
				}
			} catch (_error) {
				// nothing to declare officer
			}
		})();
	}, [open, getAccessToken, user]);

	return (
		<Panel open={open} onOpenChange={onOpenChange} title={PROFILE_TITLE}>
			<ProfileContent stats={stats} />
		</Panel>
	);
};
