import { AUTH_TYPES, useAuth } from "@versini/auth-provider";
import { ButtonIcon } from "@versini/ui-button";
import { Card } from "@versini/ui-card";
import { useUniqueId } from "@versini/ui-hooks";
import { IconPasskey } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";

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

type ChatStats = {
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

export const ProfileContent = ({ stats }: ChatStats) => {
	const { isAuthenticated, user, registeringForPasskey, authenticationType } =
		useAuth();
	const { state } = useContext(AppContext);
	const remainingTokens = GPT4_MAX_TOKENS - Number(state?.usage);

	const listId = useUniqueId();
	const listIdCurrent = useUniqueId();
	const listIdMain = useUniqueId();

	const endUser = user?.username || "";

	return isAuthenticated && endUser ? (
		<>
			<Card
				header={CARDS.PREFERENCES.TITLE}
				className="prose-dark dark:prose-lighter"
			>
				{renderDataAsList(listId, {
					[CARDS.PREFERENCES.NAME]: endUser,
					[CARDS.PREFERENCES.EMAIL]: user?.email || "",
				})}
			</Card>

			{authenticationType !== AUTH_TYPES.PASSKEY && (
				<Card
					className="prose-dark dark:prose-lighter mt-4"
					header={
						<h2 className="m-0">
							<Flexgrid columnGap={3} alignVertical="center">
								<FlexgridItem>
									<IconPasskey size="size-8" />
								</FlexgridItem>
								<FlexgridItem>
									<div>{CARDS.PREFERENCES.PASSKEY_TITLE}</div>
								</FlexgridItem>
							</Flexgrid>
						</h2>
					}
				>
					<p>{CARDS.PREFERENCES.PASSKEY_INSTRUCTIONS}</p>
					<ButtonIcon
						size="small"
						className="mt-2"
						onClick={registeringForPasskey}
						labelLeft={CARDS.PREFERENCES.PASSKEY_BUTTON}
					>
						<IconPasskey size="size-5" monotone />
					</ButtonIcon>
				</Card>
			)}

			<Card
				header={CARDS.CURRENT_STATISTICS.TITLE}
				className="prose-dark dark:prose-lighter mt-4"
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
			<Card
				header={CARDS.MAIN_STATISTICS.TITLE}
				className="prose-dark dark:prose-lighter mt-4"
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
