import { AUTH_TYPES, useAuth } from "@versini/auth-provider";
import { ButtonIcon, Card } from "@versini/ui-components";
import { Toggle } from "@versini/ui-form";
import { useLocalStorage, useUniqueId } from "@versini/ui-hooks";
import { IconEdit, IconPasskey } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { useState } from "react";

import {
	LOCAL_STORAGE_CHAT_DETAILS,
	LOCAL_STORAGE_PREFIX,
} from "../../common/constants";
import { CARDS } from "../../common/strings";

import { renderDataAsList } from "../../common/utilities";
import { CustomInstructionsPanel } from "./CustomInstructions";

export const ProfileContent = () => {
	const { isAuthenticated, user, registeringForPasskey, authenticationType } =
		useAuth();
	const [showEngineDetails, setShowEngineDetails] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_CHAT_DETAILS,
		initialValue: false,
	});

	const [showCustomInstructions, setShowCustomInstructions] = useState(false);

	const listId = useUniqueId();
	const endUser = user?.username || "";

	const onToggleEngineDetails = (checked: boolean) => {
		setShowEngineDetails(checked);
	};

	const onClickCustomInstructions = () => {
		setShowCustomInstructions(!showCustomInstructions);
	};

	return isAuthenticated && endUser ? (
		<>
			{showCustomInstructions && (
				<CustomInstructionsPanel
					open={showCustomInstructions}
					onOpenChange={setShowCustomInstructions}
				/>
			)}

			<Card
				header={CARDS.PREFERENCES.TITLE}
				className="prose-dark dark:prose-lighter"
			>
				{renderDataAsList(listId, {
					[CARDS.PREFERENCES.NAME]: endUser,
					[CARDS.PREFERENCES.EMAIL]: user?.email || "",
					[CARDS.PREFERENCES.ENGINE_DETAILS]: (
						<Toggle
							noBorder
							labelHidden
							label={CARDS.PREFERENCES.ENGINE_DETAILS}
							name={CARDS.PREFERENCES.ENGINE_DETAILS}
							onChange={onToggleEngineDetails}
							checked={showEngineDetails}
						/>
					),
				})}
				<ButtonIcon
					spacing={{ t: 2 }}
					size="small"
					onClick={onClickCustomInstructions}
					labelLeft="Engine Fine Tuning"
				>
					<IconEdit className="size-3" monotone />
				</ButtonIcon>
			</Card>

			{authenticationType !== AUTH_TYPES.PASSKEY && (
				<Card
					spacing={{ t: 4 }}
					className="prose-dark dark:prose-lighter"
					header={
						<h2 className="m-0">
							<Flexgrid columnGap={3} alignVertical="center">
								<FlexgridItem>
									<IconPasskey className="size-8" />
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
						spacing={{ t: 2 }}
						onClick={registeringForPasskey}
						labelLeft={CARDS.PREFERENCES.PASSKEY_BUTTON}
					>
						<IconPasskey className="size-5" monotone />
					</ButtonIcon>
				</Card>
			)}
		</>
	) : null;
};
