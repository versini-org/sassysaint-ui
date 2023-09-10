import { useContext, useEffect, useState } from "react";

import {
	ACTION_MODEL,
	DEFAULT_MODEL,
	GTP3_MAX_TOKENS,
	GTP4_MAX_TOKENS,
	MODEL_GPT3,
	MODEL_GPT4,
} from "../../common/constants";
import {
	CARDS,
	FAKE_USER_EMAIL,
	FAKE_USER_NAME,
	LOG_OUT,
} from "../../common/strings";
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
	const [history, setHistory] = useState<any[]>([]);
	const { state, dispatch } = useContext(AppContext);
	const endUser = isDev
		? { name: FAKE_USER_NAME, email: FAKE_USER_EMAIL }
		: user;

	let remainingTokens = GTP3_MAX_TOKENS;

	if (state?.model?.includes("4")) {
		remainingTokens = GTP4_MAX_TOKENS - Number(state?.usage);
	} else {
		remainingTokens = GTP3_MAX_TOKENS - Number(state?.usage);
	}

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

	useEffect(() => {
		(async () => {
			if (!state) {
				return;
			}
			try {
				const response = await fetch(
					`${import.meta.env.VITE_SERVER_URL}/api/chats`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							messages: state.messages,
							model: state.model,
							user: user?.email || FAKE_USER_EMAIL,
							id: state.id,
						}),
					},
				);

				if (response.status === 200) {
					const data = await response.json();
					setHistory(data);
				}
			} catch (error) {
				// nothing to declare officer
			}
		})();
	}, [state, user?.email]);

	return (isAuthenticated && endUser) || isDev ? (
		<>
			<div className="flex flex-col sm:flex-row gap-2">
				<Card
					className="w-full sm:w-1/2"
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
				<Card
					className="w-full sm:w-1/2"
					title={CARDS.STATISTICS.TITLE}
					subTitle={CARDS.STATISTICS.SUBTITLE}
					data={{
						[CARDS.STATISTICS.MODEL_NAME]: state?.model || DEFAULT_MODEL,
						[CARDS.STATISTICS.TOKENS]: remainingTokens,
					}}
				/>
			</div>
			{history && (
				<div className="flex flex-col sm:flex-row gap-2 mt-2 w-screen">
					<Card
						className="w-full max-h-48 overflow-y-scroll"
						title={CARDS.HISTORY.TITLE}
						rawData={history.map((item) => (
							<dl className="mb-2" key={`${CARDS.HISTORY.TITLE}-${item.id}`}>
								<div className="flex items-center justify-between">
									<dt className="font-bold text-slate-400 inline-block">
										{item.timestamp}
									</dt>
									<dd className="inline-block truncate">
										{item.messages[1].content}
									</dd>
								</div>
							</dl>
						))}
					/>
				</div>
			)}

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
