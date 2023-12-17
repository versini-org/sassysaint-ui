/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Card } from "@versini/ui-components";
import { useContext } from "react";

import {
	DEFAULT_MODEL,
	GTP4_MAX_TOKENS,
	ROLE_ASSISTANT,
} from "../../common/constants";
import { CARDS, NA } from "../../common/strings";
import type { MessageProps } from "../../common/types";
import { renderDataAsList } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export type ChatDetailsContentProps = {
	isAuthenticated: boolean;
	isDev: boolean;
};

const getAverageProcessingTime = (messages?: { message: MessageProps }[]) => {
	if (!messages || messages.length === 0) {
		return NA;
	}

	const processingTime = messages
		.filter((message) => message.message.role === ROLE_ASSISTANT)
		.map((data) => data.message.processingTime)
		.filter((time) => typeof time === "number");

	if (processingTime.length > 0) {
		const averageProcessingTime =
			// @ts-ignore - TS doesn't know that we filtered out the non-numbers
			processingTime.reduce((a, b) => a + b, 0) / processingTime.length;

		if (isNaN(averageProcessingTime)) {
			return NA;
		} else {
			return `${averageProcessingTime.toFixed(0)}ms`;
		}
	} else {
		return NA;
	}
};

export const ChatDetailsContent = ({
	isAuthenticated,
	isDev,
}: ChatDetailsContentProps) => {
	const { state } = useContext(AppContext);

	const remainingTokens = GTP4_MAX_TOKENS - Number(state?.usage);

	return isAuthenticated || isDev ? (
		<div className="flex flex-col gap-2 sm:flex-row">
			<Card header={CARDS.STATISTICS.TITLE}>
				{renderDataAsList(CARDS.STATISTICS.TITLE, {
					[CARDS.STATISTICS.MODEL_NAME]: state?.model || DEFAULT_MODEL,
					[CARDS.STATISTICS.TOKENS]: remainingTokens,
					[CARDS.STATISTICS.PROCESSING_TIME]: getAverageProcessingTime(
						state?.messages,
					),
				})}
			</Card>
		</div>
	) : null;
};
