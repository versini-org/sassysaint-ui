import { Card, Toggle } from "@versini/ui-components";
import { useContext } from "react";

import { LOCAL_STORAGE_ENGINE } from "../../common/constants";
import { useLocalStorage } from "../../common/hooks";
import { CARDS, FAKE_USER_EMAIL, FAKE_USER_NAME } from "../../common/strings";
import type { GeoLocation } from "../../common/types";
import {
	convertLatitudeToDMS,
	convertLongitudeToDMS,
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
	const storage = useLocalStorage();
	const { state } = useContext(AppContext);
	const endUser = isDev
		? { name: FAKE_USER_NAME, email: FAKE_USER_EMAIL }
		: user;

	const onToggleEngineDetails = (checked: boolean) => {
		storage.set(LOCAL_STORAGE_ENGINE, checked);
	};

	const renderLocation = (location?: GeoLocation) => {
		if (location?.city && location?.countryShort && location?.regionShort) {
			return (
				<>
					<div className="text-right">
						{location.city}, {location.regionShort}
					</div>
					<div className="text-right">{location.countryShort}</div>
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
		<div className="flex flex-col gap-2 sm:flex-row">
			<Card header={CARDS.PREFERENCES.TITLE}>
				{renderDataAsList(CARDS.PREFERENCES.TITLE, {
					[CARDS.PREFERENCES.NAME]: endUser.name,
					[CARDS.PREFERENCES.EMAIL]: endUser.email,
					[CARDS.PREFERENCES.ENGINE_DETAILS]: (
						<Toggle
							labelHidden
							label={CARDS.PREFERENCES.ENGINE_DETAILS}
							name={CARDS.PREFERENCES.ENGINE_DETAILS}
							kind="light"
							onChange={onToggleEngineDetails}
							checked={Boolean(storage.get(LOCAL_STORAGE_ENGINE))}
						/>
					),
					[CARDS.PREFERENCES.LOCATION]: renderLocation(state?.location),
				})}
			</Card>
		</div>
	) : null;
};
