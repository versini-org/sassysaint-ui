import { Card } from "@versini/ui-components";
import { useContext } from "react";

import {
	DEFAULT_MODEL,
	GTP3_MAX_TOKENS,
	GTP4_MAX_TOKENS,
} from "../../common/constants";
import { CARDS } from "../../common/strings";
import { renderDataAsList } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export type ChatDetailsContentProps = {
	isAuthenticated: boolean;
	isDev: boolean;
};

export const ChatDetailsContent = ({
	isAuthenticated,
	isDev,
}: ChatDetailsContentProps) => {
	const { state } = useContext(AppContext);

	let remainingTokens = GTP3_MAX_TOKENS;

	if (state?.model?.includes("4")) {
		remainingTokens = GTP4_MAX_TOKENS - Number(state?.usage);
	} else {
		remainingTokens = GTP3_MAX_TOKENS - Number(state?.usage);
	}

	return isAuthenticated || isDev ? (
		<div className="flex flex-col gap-2 sm:flex-row">
			<Card header={CARDS.STATISTICS.TITLE}>
				<h3 className="mb-4 text-sm">{CARDS.STATISTICS.SUBTITLE}</h3>
				{renderDataAsList(CARDS.STATISTICS.TITLE, {
					[CARDS.STATISTICS.MODEL_NAME]: state?.model || DEFAULT_MODEL,
					[CARDS.STATISTICS.TOKENS]: remainingTokens,
				})}
			</Card>
		</div>
	) : null;
};
