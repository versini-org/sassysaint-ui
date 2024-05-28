import { ButtonIcon, Card } from "@versini/ui-components";
import { Toggle } from "@versini/ui-form";
import { useLocalStorage, useUniqueId } from "@versini/ui-hooks";
import { useContext, useState } from "react";

import { IconRefresh } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import {
	ACTION_LOCATION,
	LOCAL_STORAGE_CHAT_DETAILS,
	LOCAL_STORAGE_LOCATION,
	LOCAL_STORAGE_PREFIX,
} from "../../common/constants";
import { CARDS, FAKE_USER_EMAIL, FAKE_USER_NAME } from "../../common/strings";
import type { GeoLocation } from "../../common/types";
import {
	convertLatitudeToDMS,
	convertLongitudeToDMS,
	getCurrentGeoLocation,
	renderDataAsList,
} from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export type ProfileContentProps = {
	isAuthenticated: boolean;
	isDev: boolean;
	user: any;
};

export const ProfileContent = ({
	isAuthenticated,
	isDev,
	user,
}: ProfileContentProps) => {
	const [showEngineDetails, setShowEngineDetails] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_CHAT_DETAILS,
		defaultValue: false,
	});
	const [, setCachedLocation, removeCachedLocation] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_LOCATION,
		defaultValue: { latitude: 0, longitude: 0, accuracy: 0 },
	});

	const [refreshEnabled, setRefreshEnabled] = useState(true);
	const listId = useUniqueId();
	const { state, dispatch } = useContext(AppContext);
	const endUser = isDev
		? { name: FAKE_USER_NAME, email: FAKE_USER_EMAIL }
		: user;

	const onToggleEngineDetails = (checked: boolean) => {
		setShowEngineDetails(checked);
	};

	const onRefreshLocation = async () => {
		setRefreshEnabled(false);
		// Refresh the location.
		console.info(`==> [${Date.now()}] : `, "Refresh location");
		removeCachedLocation();
		dispatch({
			type: ACTION_LOCATION,
			payload: {
				location: {
					latitude: 0,
					longitude: 0,
					accuracy: 0,
				},
			},
		});
		const location = await getCurrentGeoLocation();
		setCachedLocation(location);
		dispatch({
			type: ACTION_LOCATION,
			payload: {
				location,
			},
		});
	};

	const renderLocation = (location?: GeoLocation) => {
		if (location?.city && location?.countryShort && location?.regionShort) {
			return (
				<>
					<Flexgrid alignVertical="center" columnGap={4}>
						<FlexgridItem>
							<div className="text-right">
								{location.city}, {location.regionShort}
							</div>
							<div className="text-right">{location.countryShort}</div>
						</FlexgridItem>
						<FlexgridItem>
							<ButtonIcon
								disabled={!refreshEnabled}
								size="small"
								className="mt-2"
								onClick={onRefreshLocation}
							>
								<IconRefresh className="size-3" monotone />
							</ButtonIcon>
						</FlexgridItem>
					</Flexgrid>
				</>
			);
		}

		const lat = convertLatitudeToDMS(location?.latitude);
		const lon = convertLongitudeToDMS(location?.longitude);
		return (
			<>
				<div>{lat}</div>
				<div>{lon}</div>
			</>
		);
	};

	return (isAuthenticated && endUser) || isDev ? (
		<Card
			header={CARDS.PREFERENCES.TITLE}
			className="prose-dark dark:prose-lighter"
		>
			{renderDataAsList(listId, {
				[CARDS.PREFERENCES.NAME]: endUser.name,
				[CARDS.PREFERENCES.EMAIL]: endUser.email,
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
				[CARDS.PREFERENCES.LOCATION]: renderLocation(state?.location),
			})}
		</Card>
	) : null;
};
