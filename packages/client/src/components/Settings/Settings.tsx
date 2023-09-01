import { useAuth0 } from "@auth0/auth0-react";

import { isDev } from "../../common/utilities";
import { IconClose } from "..";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeading,
} from "../Dialog/Dialog";
import { SettingsContent } from "./SettingsContent";

export const Settings = ({
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
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex flex-col min-w-[95%] sm:min-w-[80%] min-h-[90%] sm:min-h-[10rem] rounded-lg border border-slate-200/10 bg-slate-400">
				<DialogHeading className="p-4 text-xl font-bold flex flex-row-reverse justify-between">
					<DialogClose iconOnly>
						<IconClose />
					</DialogClose>
					<div>Profile</div>
				</DialogHeading>

				<DialogDescription className="flex flex-col flex-grow p-4">
					<SettingsContent
						isAuthenticated={isAuthenticated}
						isDev={isDev}
						logoutWithRedirect={logoutWithRedirect}
						user={user}
					/>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};
