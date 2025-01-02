import { AUTH_TYPES, useAuth } from "@versini/auth-provider";
import { ButtonIcon } from "@versini/ui-button";
import { Card } from "@versini/ui-card";
import { useUniqueId } from "@versini/ui-hooks";
import { IconPasskey } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";

import { CARDS } from "../../common/strings";
import {
	durationFormatter,
	pluralize,
	renderDataAsList,
} from "../../common/utilities";

type ChatStats = {
	stats: {
		averageProcessingTimes: number;
		totalChats: number;
	};
};

export const ProfileContent = ({ stats }: ChatStats) => {
	const { isAuthenticated, user, registeringForPasskey, authenticationType } =
		useAuth();

	const listId = useUniqueId();
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
