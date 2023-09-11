import { useContext } from "react";

import {
	DEFAULT_MODEL,
	GTP3_MAX_TOKENS,
	GTP4_MAX_TOKENS,
} from "../../common/constants";
import { CARDS, FAKE_USER_EMAIL, FAKE_USER_NAME } from "../../common/strings";
import { AppContext } from "../../modules/AppContext";
import { Card } from "..";

export type ChatDetailsContentProps = {
	isAuthenticated: boolean;
	isDev: boolean;
	logoutWithRedirect: () => void;
	user: any;
};

export const ChatDetailsContent = ({
	isAuthenticated,
	isDev,
	user,
}: ChatDetailsContentProps) => {
	const { state } = useContext(AppContext);
	const endUser = isDev
		? { name: FAKE_USER_NAME, email: FAKE_USER_EMAIL }
		: user;

	let remainingTokens = GTP3_MAX_TOKENS;

	if (state?.model?.includes("4")) {
		remainingTokens = GTP4_MAX_TOKENS - Number(state?.usage);
	} else {
		remainingTokens = GTP3_MAX_TOKENS - Number(state?.usage);
	}

	return (isAuthenticated && endUser) || isDev ? (
		<>
			<div className="flex flex-col sm:flex-row gap-2">
				<Card
					className="w-full"
					title={CARDS.STATISTICS.TITLE}
					subTitle={CARDS.STATISTICS.SUBTITLE}
					data={{
						[CARDS.STATISTICS.MODEL_NAME]: state?.model || DEFAULT_MODEL,
						[CARDS.STATISTICS.TOKENS]: remainingTokens,
					}}
				/>
			</div>
		</>
	) : null;
};
