import { Card } from "@versini/ui-components";
import { useContext, useEffect, useState } from "react";

import {
	DEFAULT_MODEL,
	GTP4_MAX_TOKENS,
	ROLE_ASSISTANT,
} from "../../common/constants";
import { CARDS, FAKE_USER_EMAIL, NA } from "../../common/strings";
import type { MessageProps } from "../../common/types";
import {
	extractAverage,
	isDev,
	renderDataAsList,
	serviceCall,
} from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export type ChatDetailsContentProps = {
	isAuthenticated: boolean;
	historyData: any[];
	user: any;
};

const averageProcessingTimeFormatter = (value: number) =>
	`${value.toFixed(0)}ms`;

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

const getAverageProcessingTimes = (chatSessions?: any[]) => {
	const averageProcessingTimes: number[] = [];

	if (!chatSessions || chatSessions.length === 0) {
		return NA;
	}

	chatSessions.forEach((chatSession) => {
		const processingTime = chatSession
			.filter(
				(message: any) =>
					message?.role === ROLE_ASSISTANT &&
					typeof message?.processingTime === "number" &&
					message?.processingTime > 0,
			)
			.map((data: any) => data.processingTime);

		if (processingTime.length > 0) {
			averageProcessingTimes.push(
				extractAverage({
					data: processingTime,
					formatter: (value) => value,
				}),
			);
		}
	});

	return extractAverage({
		data: averageProcessingTimes,
		formatter: averageProcessingTimeFormatter,
	});
};

const extractStatisticsFromHistory = (history: any[]) => {
	return {
		total: history.length,
		processingTime: getAverageProcessingTimes(
			history.map((item) => item?.messages),
		),
	};
};

export const ChatDetailsContent = ({
	isAuthenticated,
	historyData,
	user,
}: ChatDetailsContentProps) => {
	const { state } = useContext(AppContext);
	const [history, setHistory] = useState<any[]>(historyData);
	const [statistics, setStatistics] = useState({
		total: 0,
		processingTime: NA,
	});
	const remainingTokens = GTP4_MAX_TOKENS - Number(state?.usage);

	/**
	 * Effect to update the statistics.
	 */
	useEffect(() => {
		let isCancelled = false;
		(async () => {
			// there is no state
			if (!state) {
				return;
			}
			// we already have the data
			if (history.length > 0 && !isCancelled) {
				setStatistics(extractStatisticsFromHistory(history));
				return;
			}

			try {
				const response = await serviceCall({
					name: "chats",
					data: {
						messages: state.messages,
						model: state.model,
						user: user?.email || FAKE_USER_EMAIL,
						id: state.id,
					},
				});

				if (response.status === 200 && !isCancelled) {
					const data = await response.json();
					setHistory(data.messages);
				}
			} catch (error) {
				// nothing to declare officer
			}
		})();
		return () => {
			isCancelled = true;
		};
	}, [history, state, user?.email]);

	return isAuthenticated || isDev ? (
		<>
			{state && state.messages.length > 0 && (
				<div className="mb-4">
					<Card header={CARDS.CURRENT_STATISTICS.TITLE}>
						{renderDataAsList(CARDS.CURRENT_STATISTICS.TITLE, {
							[CARDS.CURRENT_STATISTICS.MODEL_NAME]:
								state?.model || DEFAULT_MODEL,
							[CARDS.CURRENT_STATISTICS.TOKENS]: remainingTokens,
							[CARDS.CURRENT_STATISTICS.PROCESSING_TIME]:
								getAverageProcessingTimePerSession(state?.messages),
						})}
					</Card>
				</div>
			)}

			<Card header={CARDS.MAIN_STATISTICS.TITLE}>
				{renderDataAsList(CARDS.MAIN_STATISTICS.TITLE, {
					[CARDS.MAIN_STATISTICS.TOTAL]: statistics.total,
					[CARDS.MAIN_STATISTICS.PROCESSING_TIME]: statistics.processingTime,
				})}
			</Card>
		</>
	) : null;
};
