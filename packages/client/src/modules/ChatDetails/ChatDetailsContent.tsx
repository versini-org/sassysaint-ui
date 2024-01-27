import { Card } from "@versini/ui-components";
import { useContext } from "react";

import {
	DEFAULT_MODEL,
	GPT3_MAX_TOKENS,
	GPT4_MAX_TOKENS,
	MODEL_GPT4,
	ROLE_ASSISTANT,
} from "../../common/constants";
import { CARDS, NA } from "../../common/strings";
import type { MessageProps } from "../../common/types";
import {
	extractAverage,
	isDev,
	numberFormatter,
	renderDataAsList,
} from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export type ChatDetailsContentProps = {
	isAuthenticated: boolean;
	stats: {
		averageProcessingTimes: number;
		totalChats: number;
	};
	user: any;
};

const averageProcessingTimeFormatter = (value: number) =>
	`${numberFormatter.format(value)} ms`;

const getAverageProcessingTimePerSession = (
	chatSession?: { message: MessageProps }[],
) => {
	if (!chatSession || chatSession.length === 0) {
		return NA;
	}

	const processingTimes = chatSession
		.filter(
			(message) =>
				message?.message?.role === ROLE_ASSISTANT &&
				typeof message?.message?.processingTime === "number",
		)
		.map((data) => data.message.processingTime);

	return extractAverage({
		data: processingTimes,
		formatter: averageProcessingTimeFormatter,
	});
};

export const ChatDetailsContent = ({
	isAuthenticated,
	stats,
}: ChatDetailsContentProps) => {
	const { state } = useContext(AppContext);
	const remainingTokens =
		state?.model === MODEL_GPT4
			? GPT4_MAX_TOKENS
			: GPT3_MAX_TOKENS - Number(state?.usage);

	return isAuthenticated || isDev ? (
		<>
			{state && state.messages.length > 0 && (
				<div className="mb-4">
					<Card header={CARDS.CURRENT_STATISTICS.TITLE}>
						{renderDataAsList(CARDS.CURRENT_STATISTICS.TITLE, {
							[CARDS.CURRENT_STATISTICS.MODEL_NAME]:
								state?.model || DEFAULT_MODEL,
							[CARDS.CURRENT_STATISTICS.TOKENS]:
								numberFormatter.format(remainingTokens),
							[CARDS.CURRENT_STATISTICS.PROCESSING_TIME]:
								getAverageProcessingTimePerSession(state?.messages),
						})}
					</Card>
				</div>
			)}

			<Card header={CARDS.MAIN_STATISTICS.TITLE}>
				{renderDataAsList(CARDS.MAIN_STATISTICS.TITLE, {
					[CARDS.MAIN_STATISTICS.TOTAL]: stats.totalChats,
					[CARDS.MAIN_STATISTICS.PROCESSING_TIME]:
						`${numberFormatter.format(stats.averageProcessingTimes)} ms`,
				})}
			</Card>
		</>
	) : null;
};
