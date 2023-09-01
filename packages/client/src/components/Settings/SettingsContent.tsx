import { Button } from "..";

export type SettingsContentProps = {
	isAuthenticated: boolean;
	isDev: boolean;
	logoutWithRedirect: () => void;
	user: any;
};

export const SettingsContent = ({
	isAuthenticated,
	isDev,
	logoutWithRedirect,
	user,
}: SettingsContentProps) => {
	const endUser = isDev ? { name: "ArnoDev", email: "toto@titi.fr" } : user;

	return (isAuthenticated && endUser) || isDev ? (
		<>
			<dl>
				<dt className="font-bold">User</dt>
				<dd className="mb-2">{endUser.name}</dd>
				<dt className="font-bold">Email</dt>
				<dd className="mb-2">{endUser.email}</dd>
			</dl>
			<Button
				disabled={isDev}
				className="mt-5"
				onClick={() => logoutWithRedirect()}
			>
				Log out
			</Button>
		</>
	) : null;
};
