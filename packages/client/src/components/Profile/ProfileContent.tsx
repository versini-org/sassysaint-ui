import { useContext } from "react";

import { ACTION_MODEL, MODEL_GPT3, MODEL_GPT4 } from "../../common/constants";
import {
	CARDS,
	FAKE_USER_EMAIL,
	FAKE_USER_NAME,
	LOG_OUT,
} from "../../common/strings";
import { persistModel } from "../../common/utilities";
import { AppContext } from "../../modules/AppContext";
import { Button, Card, Toggle } from "..";

export type ProfileContentProps = {
	isAuthenticated: boolean;
	isDev: boolean;
	logoutWithRedirect: () => void;
	user: any;
};

export const ProfileContent = ({
	isAuthenticated,
	isDev,
	logoutWithRedirect,
	user,
}: ProfileContentProps) => {
	const { state, dispatch } = useContext(AppContext);
	const endUser = isDev
		? { name: FAKE_USER_NAME, email: FAKE_USER_EMAIL }
		: user;

	const onToggleGPT = (checked: boolean) => {
		persistModel(checked ? MODEL_GPT4 : MODEL_GPT3);
		dispatch({
			type: ACTION_MODEL,
			payload: {
				model: checked ? MODEL_GPT4 : MODEL_GPT3,
				usage: state?.usage || 0,
			},
		});
	};

	return (isAuthenticated && endUser) || isDev ? (
		<>
			<div className="flex flex-col sm:flex-row gap-2">
				<Card
					className="w-full"
					title={CARDS.PREFERENCES.TITLE}
					data={{
						[CARDS.PREFERENCES.NAME]: endUser.name,
						[CARDS.PREFERENCES.EMAIL]: endUser.email,
						"GPT-4": (
							<Toggle
								onChange={onToggleGPT}
								checked={state?.model?.includes("4")}
							/>
						),
					}}
				/>
			</div>

			<Button
				fullWidth
				disabled={isDev}
				className="mt-2"
				onClick={() => logoutWithRedirect()}
			>
				<span className="text-red-600">{LOG_OUT}</span>
			</Button>
		</>
	) : null;
};
