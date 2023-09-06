import { useContext } from "react";

import {
	DEFAULT_MODEL,
	GTP3_MAX_TOKENS,
	GTP4_MAX_TOKENS,
	MODEL_GPT3,
	MODEL_GPT4,
	ROLE_HIDDEN,
} from "../../common/constants";
import { persistMode, retrieveMode } from "../../common/utilities";
import { Button, Card, Toggle } from "..";
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
	const { state, dispatch } = useContext(MessagesContext);
	const mode = retrieveMode() || DEFAULT_MODEL;
	const endUser = isDev ? { name: "ArnoDev", email: "toto@titi.fr" } : user;
	const endState =
		state && state.length > 0 && state[state.length - 1]
			? state[state.length - 1]
			: { model: mode, usage: 0 };

	let remainingTokens = GTP3_MAX_TOKENS;

	if (typeof endState?.usage === "number") {
		if (endState?.model?.includes("4")) {
			remainingTokens = GTP4_MAX_TOKENS - Number(endState.usage);
		} else {
			remainingTokens = GTP3_MAX_TOKENS - Number(endState.usage);
		}
	}

	const onToggleGPT = (checked: boolean) => {
		persistMode(checked ? MODEL_GPT4 : MODEL_GPT3);
		dispatch({
			message: {
				role: ROLE_HIDDEN,
				content: checked ? MODEL_GPT4 : MODEL_GPT3,
			},
			model: checked ? MODEL_GPT4 : MODEL_GPT3,
			usage: endState.usage,
		});
	};

	return (isAuthenticated && endUser) || isDev ? (
		<>
			<div className="flex flex-col sm:flex-row gap-2">
				<Card
					className="w-full sm:w-1/2"
					title="User preferences"
					data={{
						Name: endUser.name,
						Email: endUser.email,
						"GPT-4": (
							<Toggle
								onChange={onToggleGPT}
								checked={endState?.model?.includes("4")}
							/>
						),
					}}
				/>
				<Card
					className="w-full sm:w-1/2"
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
