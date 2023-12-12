import { useAuth0 } from "@auth0/auth0-react";
import { Panel } from "@versini/ui-components";

import { PROFILE_TITLE } from "../../common/strings";
import { isDev } from "../../common/utilities";
import { ProfileContent } from "./ProfileContent";

export const Profile = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: any;
}) => {
	const { logout, isAuthenticated, user } = useAuth0();

	const logoutWithRedirect = () =>
		logout({
			logoutParams: {
				returnTo: window.location.origin,
			},
		});

	return (
		<Panel open={open} onOpenChange={onOpenChange} title={PROFILE_TITLE}>
			<ProfileContent
				isAuthenticated={isAuthenticated}
				isDev={isDev}
				logoutWithRedirect={logoutWithRedirect}
				user={user}
			/>
		</Panel>
	);
};
