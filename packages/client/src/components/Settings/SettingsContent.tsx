import { useContext } from "react";

import {
	DEFAULT_MODEL,
	GTP3_MAX_TOKENS,
	GTP4_MAX_TOKENS,
} from "../../common/constants";
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
			: { model: DEFAULT_MODEL, usage: 0 };

	let remainingTokens = GTP3_MAX_TOKENS;

	if (typeof endState?.usage === "number") {
		if (endState?.model?.includes("4")) {
			remainingTokens = GTP4_MAX_TOKENS - Number(endState.usage);
		} else {
			remainingTokens = GTP3_MAX_TOKENS - Number(endState.usage);
		}
	}

	return (isAuthenticated && endUser) || isDev ? (
		<div className="grid grid-flow-col justify-stretch gap-x-1">
			<div className="border-slate-900 border-2 rounded-md p-4 bg-slate-900 text-slate-200">
				<h2 className="font-bold text-lg mb-4">User information</h2>
				<dl>
					<dt className="font-bold text-slate-400">Name</dt>
					<dd className="mb-4">{endUser.name}</dd>
					<dt className="font-bold text-slate-400">Email</dt>
					<dd className="mb-4">{endUser.email}</dd>

					<Button
						kind="light"
						fullWidth
						slim
						disabled={isDev}
						className="mt-5"
						onClick={() => logoutWithRedirect()}
					>
						Log out
					</Button>
				</dl>
			</div>

			<div className="border-slate-900 border-2 rounded-md p-4 bg-slate-900 text-slate-200">
				<h2 className="font-bold text-lg mb-4">Real time statistics</h2>
				<dl>
					<dt className="font-bold text-slate-400">GTP model</dt>
					<dd className="mb-4">{endState.model}</dd>
					<dt className="font-bold text-slate-400">Remaining tokens</dt>
					<dd className="mb-4">{remainingTokens}</dd>
				</dl>
			</div>
		</div>
	) : null;
};
