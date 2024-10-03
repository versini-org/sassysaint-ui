import { Card } from "@versini/ui-card";
import { useUniqueId } from "@versini/ui-hooks";
import { useContext } from "react";

import {
	DEFAULT_AI_ENGINE,
	GPT4_MAX_TOKENS,
	ROLE_ASSISTANT,
} from "../../common/constants";
import { CARDS, NA } from "../../common/strings";
import type { MessageProps } from "../../common/types";
import {
	durationFormatter,
	extractAverage,
	numberFormatter,
	pluralize,
	renderDataAsList,
} from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export type ChatDetailsContentProps = {
	isAuthenticated: boolean;
	stats: {
		averageProcessingTimes: number;
		totalChats: number;
	};
};

const averageProcessingTimeFormatter = (value: number) =>
	durationFormatter(value);

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
	const remainingTokens = GPT4_MAX_TOKENS - Number(state?.usage);
	const listIdCurrent = useUniqueId();
	const listIdMain = useUniqueId();

	return isAuthenticated ? (
		<>
			{state && state.messages.length > 0 && (
				<div className="mb-4">
					<Card
						header={CARDS.CURRENT_STATISTICS.TITLE}
						className="prose-dark dark:prose-lighter"
					>
						{renderDataAsList(listIdCurrent, {
							[CARDS.CURRENT_STATISTICS.MODEL_NAME]:
								state?.model || DEFAULT_AI_ENGINE,
							[CARDS.CURRENT_STATISTICS.TOKENS_USED]: state?.usage,
							[CARDS.CURRENT_STATISTICS.REMAINING_TOKENS]:
								numberFormatter.format(remainingTokens),
							[CARDS.CURRENT_STATISTICS.PROCESSING_TIME]:
								getAverageProcessingTimePerSession(state?.messages),
						})}
					</Card>
				</div>
			)}

			<Card
				header={CARDS.MAIN_STATISTICS.TITLE}
				className="prose-dark dark:prose-lighter"
			>
				{renderDataAsList(listIdMain, {
					[pluralize(CARDS.MAIN_STATISTICS.TOTAL, stats.totalChats)]:
						stats.totalChats,
					[CARDS.MAIN_STATISTICS.PROCESSING_TIME]: durationFormatter(
						stats.averageProcessingTimes,
					),
				})}
			</Card>
		</>
	) : null;
};
