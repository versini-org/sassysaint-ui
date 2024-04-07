import { Card } from "@versini/ui-components";
import { Toggle } from "@versini/ui-form";
import { useLocalStorage } from "@versini/ui-hooks";
import { useContext } from "react";

import {
	ACTION_MODEL,
	ACTION_RESET,
	LOCAL_STORAGE_CHAT_DETAILS,
	LOCAL_STORAGE_MODEL,
	LOCAL_STORAGE_PREFIX,
	MODEL_GPT3,
	MODEL_GPT4,
} from "../../common/constants";
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
	const [showEngineDetails, setShowEngineDetails] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_CHAT_DETAILS,
		defaultValue: false,
	});
	const [showModelType, setShowModelType] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_MODEL,
		defaultValue: false,
	});

	const { state, dispatch } = useContext(AppContext);
	const endUser = isDev
		? { name: FAKE_USER_NAME, email: FAKE_USER_EMAIL }
		: user;

	const onToggleEngineDetails = (checked: boolean) => {
		setShowEngineDetails(checked);
	};

	const onToggleModelType = (checked: boolean) => {
		setShowModelType(checked);
		dispatch({
			type: ACTION_MODEL,
			payload: {
				usage: state?.usage || 0,
				model: checked ? MODEL_GPT4 : MODEL_GPT3,
			},
		});
		dispatch({
			type: ACTION_RESET,
		});
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
		<Card
			header={CARDS.PREFERENCES.TITLE}
			className="prose-dark dark:prose-lighter"
		>
			{renderDataAsList(CARDS.PREFERENCES.TITLE, {
				[CARDS.PREFERENCES.NAME]: endUser.name,
				[CARDS.PREFERENCES.EMAIL]: endUser.email,
				[CARDS.PREFERENCES.ENGINE_DETAILS]: (
					<Toggle
						labelHidden
						label={CARDS.PREFERENCES.ENGINE_DETAILS}
						name={CARDS.PREFERENCES.ENGINE_DETAILS}
						onChange={onToggleEngineDetails}
						checked={showEngineDetails}
					/>
				),
				[CARDS.PREFERENCES.MODEL_TYPE]: (
					<Toggle
						labelHidden
						label={CARDS.PREFERENCES.MODEL_TYPE}
						name={CARDS.PREFERENCES.MODEL_TYPE}
						onChange={onToggleModelType}
						checked={showModelType}
					/>
				),
				[CARDS.PREFERENCES.LOCATION]: renderLocation(state?.location),
			})}
		</Card>
	) : null;
};
