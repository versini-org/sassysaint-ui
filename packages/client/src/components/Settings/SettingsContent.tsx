import { useContext } from "react";

import { Button } from "..";
import { MessagesContext } from "../Messages/MessagesContext";

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
	const { state } = useContext(MessagesContext);

	const endUser = isDev ? { name: "ArnoDev", email: "toto@titi.fr" } : user;

	const endState =
		state && state.length > 0 && state[state.length - 1]
			? state[state.length - 1]
			: { model: "N/A", usage: "N/A" };

	if (endState?.model?.includes("3.5") && !endState?.usage?.includes("N/A")) {
		endState.usage = `${endState.usage} / 4096`;
	}
	if (endState?.model?.includes("4") && !endState?.usage?.includes("N/A")) {
		endState.usage = `${endState.usage} / 8192`;
	}

	return (isAuthenticated && endUser) || isDev ? (
		<div className="grid grid-flow-col justify-stretch gap-x-1">
			<div className="border-slate-800 border-2 rounded-md p-4">
				<h2 className="font-bold text-lg mb-2">User information</h2>
				<dl>
					<dt className="font-bold">Name</dt>
					<dd className="mb-2">{endUser.name}</dd>
					<dt className="font-bold">Email</dt>
					<dd className="mb-2">{endUser.email}</dd>

					<Button
						slim
						disabled={isDev}
						className="mt-5"
						onClick={() => logoutWithRedirect()}
					>
						Log out
					</Button>
				</dl>
			</div>

			<div className="border-slate-800 border-2 rounded-md p-4">
				<h2 className="font-bold text-lg mb-2">Real time statistics</h2>
				<dl>
					<dt className="font-bold">GTP model</dt>
					<dd className="mb-2">{endState.model}</dd>
					<dt className="font-bold">Usage</dt>
					<dd className="mb-2">{endState.usage}</dd>
				</dl>
			</div>
		</div>
	) : null;
};
