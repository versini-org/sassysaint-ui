import { useContext } from "react";

import {
	ACTION_MODEL,
	LOCAL_STORAGE_ENGINE,
	LOCAL_STORAGE_MODEL,
	MODEL_GPT3,
	MODEL_GPT4,
} from "../../common/constants";
import { useLocalStorage } from "../../common/hooks";
import {
	CARDS,
	FAKE_USER_EMAIL,
	FAKE_USER_NAME,
	LOG_OUT,
} from "../../common/strings";
import type { GeoLocation } from "../../common/types";
import {
	convertLatitudeToDMS,
	convertLongitudeToDMS,
} from "../../common/utilities";
import { Button, Card, Toggle } from "../../components";
import { AppContext } from "../App/AppContext";

export type ProfileContentProps = {
	isAuthenticated: boolean;
	isDev: boolean;
	logoutWithRedirect: () => void;
	user: any;
};

export const ProfileContent = ({
	isAuthenticated,
	isDev,
	logoutWithRedirect,
	user,
}: ProfileContentProps) => {
	const storage = useLocalStorage();
	const { state, dispatch } = useContext(AppContext);
	const endUser = isDev
		? { name: FAKE_USER_NAME, email: FAKE_USER_EMAIL }
		: user;

	const onToggleGPT = (checked: boolean) => {
		storage.set(LOCAL_STORAGE_MODEL, checked ? MODEL_GPT4 : MODEL_GPT3);
		dispatch({
			type: ACTION_MODEL,
			payload: {
				model: checked ? MODEL_GPT4 : MODEL_GPT3,
				usage: state?.usage || 0,
			},
		});
	};

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
		<>
			<div className="flex flex-col gap-2 sm:flex-row">
				<Card
					className="w-full"
					title={CARDS.PREFERENCES.TITLE}
					data={{
						[CARDS.PREFERENCES.NAME]: endUser.name,
						[CARDS.PREFERENCES.EMAIL]: endUser.email,
						[CARDS.PREFERENCES.MODEL_NAME]: (
							<Toggle
								onChange={onToggleGPT}
								checked={state?.model?.includes("4")}
							/>
						),
						[CARDS.PREFERENCES.ENGINE_DETAILS]: (
							<Toggle
								onChange={onToggleEngineDetails}
								checked={Boolean(storage.get(LOCAL_STORAGE_ENGINE))}
							/>
						),
						[CARDS.PREFERENCES.LOCATION]: renderLocation(state?.location),
					}}
				/>
			</div>

			<Button
				fullWidth
				disabled={isDev}
				className="mt-2"
				onClick={() => logoutWithRedirect()}
			>
				<span className="text-red-600">{LOG_OUT}</span>
			</Button>
		</>
	) : null;
};
