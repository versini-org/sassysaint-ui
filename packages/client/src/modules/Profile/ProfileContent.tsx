import { useAuth } from "@versini/auth-provider";
import { ButtonIcon, Card } from "@versini/ui-components";
import { Toggle } from "@versini/ui-form";
import { useLocalStorage, useUniqueId } from "@versini/ui-hooks";
import { IconRefresh } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { useContext, useEffect, useState } from "react";

import {
	ACTION_LOCATION,
	LOCAL_STORAGE_CHAT_DETAILS,
	LOCAL_STORAGE_LOCATION,
	LOCAL_STORAGE_PREFIX,
} from "../../common/constants";
import { CARDS } from "../../common/strings";
import type { GeoLocation } from "../../common/types";
import {
	convertLatitudeToDMS,
	convertLongitudeToDMS,
	getCurrentGeoLocation,
	renderDataAsList,
} from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export const ProfileContent = () => {
	const { isAuthenticated, user } = useAuth();
	const [showEngineDetails, setShowEngineDetails] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_CHAT_DETAILS,
		initialValue: false,
	});
	const [, setCachedLocation, removeCachedLocation] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_LOCATION,
		initialValue: { latitude: 0, longitude: 0, accuracy: 0 },
	});

	const [refreshEnabled, setRefreshEnabled] = useState(true);
	const listId = useUniqueId();
	const { state, dispatch } = useContext(AppContext);
	const endUser = user?.username || "";

	const onToggleEngineDetails = (checked: boolean) => {
		setShowEngineDetails(checked);
	};

	const onRefreshLocation = async () => {
		// Disable the refresh button
		setRefreshEnabled(false);
		// Remove the cached location
		removeCachedLocation();
		// Reset the location in state so that it is reflected in the UI
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
		// Get the current location (latitude, longitude, accuracy)
		const location = await getCurrentGeoLocation();
		// Save the location in the local storage
		setCachedLocation(location);
		/**
		 * Update the location in the state, which will also trigger
		 * a fetch for detailed location information (city, region, country),
		 * and update the UI...
		 */
		dispatch({
			type: ACTION_LOCATION,
			payload: {
				location,
			},
		});
	};

	useEffect(() => {
		let timeoutId: number;
		if (!refreshEnabled) {
			timeoutId = window.setTimeout(() => {
				setRefreshEnabled(true);
			}, 3000);
		}
		return () => {
			clearTimeout(timeoutId);
		};
	}, [refreshEnabled]);

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
				<Flexgrid alignVertical="center" columnGap={4}>
					<FlexgridItem>
						<div>{lat}</div>
						<div>{lon}</div>
					</FlexgridItem>
					<FlexgridItem>
						<ButtonIcon disabled size="small" className="mt-2">
							<IconRefresh className="size-3" monotone />
						</ButtonIcon>
					</FlexgridItem>
				</Flexgrid>
			</>
		);
	};

	return isAuthenticated && endUser ? (
		<Card
			header={CARDS.PREFERENCES.TITLE}
			className="prose-dark dark:prose-lighter"
		>
			{renderDataAsList(listId, {
				[CARDS.PREFERENCES.NAME]: endUser,
				// [CARDS.PREFERENCES.EMAIL]: endUser.email,
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
