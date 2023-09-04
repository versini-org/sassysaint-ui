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

type CardProps = {
	title: string;
	subTitle?: string;
	data: {
		[key: string]: string | number | undefined;
	};
};

const Card = ({ title, subTitle, data }: CardProps) => {
	const titleClass = subTitle ? "font-bold text-lg" : "font-bold text-lg mb-4";
	return (
		<div className="border-slate-900 border-2 rounded-md p-4 bg-slate-900 text-slate-200">
			<h2 className={titleClass}>{title}</h2>
			{subTitle && <h3 className="text-sm mb-4">{subTitle}</h3>}
			{Object.keys(data).map((idx) => {
				return (
					<dl key={`${title}-${idx}`}>
						<div className="flex justify-between sm:block">
							<dt className="font-bold text-slate-400 sm:block inline-block">
								{idx}
							</dt>
							<dd className="mb-4 sm:block inline-block">{data[idx]}</dd>
						</div>
					</dl>
				);
			})}
		</div>
	);
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
		<>
			<div className="grid sm:grid-flow-col grid-flow-row justify-stretch gap-2">
				<Card
					title="User information"
					data={{
						Name: endUser.name,
						Email: endUser.email,
					}}
				/>
				<Card
					title="Real time statistics"
					subTitle="(current chat session)"
					data={{
						"GTP model": endState.model,
						"Remaining tokens": remainingTokens,
					}}
				/>
			</div>
			<Button
				fullWidth
				disabled={isDev}
				className="mt-2"
				onClick={() => logoutWithRedirect()}
			>
				<span className="text-red-600">Log out</span>
			</Button>
		</>
	) : null;
};
