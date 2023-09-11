import { useAuth0 } from "@auth0/auth0-react";

import { PROFILE_TITLE } from "../../common/strings";
import { isDev } from "../../common/utilities";
import { IconClose } from "..";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeading,
} from "../Dialog/Dialog";
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
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				overlayBackground="bg-slate-500 sm:bg-black/[.8]"
				className="flex flex-col w-full sm:w-[95%] md:max-w-2xl min-h-[90%] sm:min-h-[10rem] rounded-lg border border-slate-200/10 bg-slate-400"
			>
				<DialogHeading className="p-4 text-xl font-bold flex flex-row-reverse justify-between">
					<DialogClose iconOnly>
						<IconClose />
					</DialogClose>
					<div>{PROFILE_TITLE}</div>
				</DialogHeading>

				<DialogDescription className="flex flex-col flex-grow p-4">
					<ProfileContent
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
