export type SettingsContentProps = {
	buttonClasses: string;
	isAuthenticated: boolean;
	isDev: boolean;
	logoutWithRedirect: () => void;
	user: any;
};

export const SettingsContent = ({
	buttonClasses,
	isAuthenticated,
	isDev,
	logoutWithRedirect,
	user,
}: SettingsContentProps) => {
	const endUser = isDev ? { name: "Arno", email: "versini@gmail.com" } : user;

	return (isAuthenticated && endUser) || isDev ? (
		<>
			<dl>
				<dt className="font-bold">User</dt>
				<dd className="mb-2">{endUser.name}</dd>
				<dt className="font-bold">Email</dt>
				<dd className="mb-2">{endUser.email}</dd>
			</dl>
			<button
				disabled={isDev}
				className={`${buttonClasses} mt-5`}
				onClick={() => logoutWithRedirect()}
			>
				Log out
			</button>
		</>
	) : null;
};
