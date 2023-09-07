import { useContext } from "react";

import {
	ACTION,
	DEFAULT_MODEL,
	GTP3_MAX_TOKENS,
	GTP4_MAX_TOKENS,
	MODEL_GPT3,
	MODEL_GPT4,
} from "../../common/constants";
import { persistModel } from "../../common/utilities";
import { AppContext } from "../../modules/AppContext";
import { Button, Card, Toggle } from "..";

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
	const { state, dispatch } = useContext(AppContext);
	const endUser = isDev ? { name: "ArnoDev", email: "toto@titi.fr" } : user;

	let remainingTokens = GTP3_MAX_TOKENS;

	if (state?.model?.includes("4")) {
		remainingTokens = GTP4_MAX_TOKENS - Number(state?.usage);
	} else {
		remainingTokens = GTP3_MAX_TOKENS - Number(state?.usage);
	}

	const onToggleGPT = (checked: boolean) => {
		persistModel(checked ? MODEL_GPT4 : MODEL_GPT3);
		dispatch({
			type: ACTION.MODEL,
			payload: {
				model: checked ? MODEL_GPT4 : MODEL_GPT3,
			},
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
								checked={state?.model?.includes("4")}
							/>
						),
					}}
				/>
				<Card
					className="w-full sm:w-1/2"
					title="Real time statistics"
					subTitle="(current chat session)"
					data={{
						"GTP model": state?.model || DEFAULT_MODEL,
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
