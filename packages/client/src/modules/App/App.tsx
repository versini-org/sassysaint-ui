import { useAuth } from "@versini/auth-provider";
import { Main, TableCellSortDirections } from "@versini/ui-components";
import { useLocalStorage } from "@versini/ui-hooks";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
	ACTION_LOCATION,
	LOCAL_STORAGE_LOCATION,
	LOCAL_STORAGE_PREFIX,
	LOCAL_STORAGE_SEARCH,
	LOCAL_STORAGE_SORT,
	MODEL_GPT4,
} from "../../common/constants";
import { SERVICE_TYPES, serviceCall } from "../../common/services";
import type { ServerStatsProps } from "../../common/types";
import { getCurrentGeoLocation } from "../../common/utilities";
import { AppFooter } from "../Footer/AppFooter";
import { MessagesContainer } from "../Messages/MessagesContainer";
import { AppContext, HistoryContext } from "./AppContext";
import { historyReducer, reducer } from "./reducer";

function App({ isComponent = false }: { isComponent?: boolean }) {
	const loadingBasicLocationRef = useRef(false);
	const loadingDetailedLocationRef = useRef(false);
	const loadingServerStatsRef = useRef(false);
	const { isAuthenticated, getAccessToken } = useAuth();
	const [cachedSearchedString] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_SEARCH,
		initialValue: "",
	});
	const [cachedSortDirection] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_SORT,
		initialValue: TableCellSortDirections.ASC,
	});
	const [cachedLocation, setCachedLocation] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_LOCATION,
		initialValue: { latitude: 0, longitude: 0, accuracy: 0 },
	});

	const [state, dispatch] = useReducer(reducer, {
		id: uuidv4(),
		model: MODEL_GPT4,
		usage: 0,
		messages: [],
		isComponent,
	});
	const [stateHistory, dispatchHistory] = useReducer(historyReducer, {
		searchString: cachedSearchedString,
		sortedCell: "timestamp",
		sortDirection: cachedSortDirection,
	});
	const [serverStats, setServerStats] = useState<ServerStatsProps>({
		version: "",
		models: [],
		plugins: [],
	});

	const onLocationError = useCallback(() => {
		dispatch({
			type: ACTION_LOCATION,
			payload: {
				location: {
					...cachedLocation,
					city: "N/A",
				},
			},
		});
	}, [cachedLocation]);

	/**
	 * Effect to fetch the server stats from the ... server.
	 */
	useEffect(() => {
		// We already have the server stats or we are in the process of fetching them.
		if (serverStats.version !== "" || loadingServerStatsRef.current) {
			return;
		}
		(async () => {
			try {
				loadingServerStatsRef.current = true;
				const response = await serviceCall({
					accessToken: await getAccessToken(),
					type: SERVICE_TYPES.ABOUT,
				});
				loadingServerStatsRef.current = false;

				if (response.status === 200) {
					setServerStats(response.data);
				}
			} catch (_error) {
				// nothing to declare officer
			}
		})();
	}, [serverStats, getAccessToken]);

	/**
	 * Effect to retreive the location of the user using the
	 * browser's geolocation API.
	 */
	useEffect(() => {
		/**
		 * The user is in the process of being authenticated.
		 * We cannot request for location yet.
		 */
		if (!isAuthenticated) {
			return;
		}

		/**
		 * We already tried to fetch the location, no need to try again.
		 */
		if (loadingBasicLocationRef.current) {
			return;
		}

		/**
		 * If we do not have the location cached in local storage,
		 * or the accuracy is 0, we need to request for the location.
		 */
		if (!cachedLocation || cachedLocation.accuracy === 0) {
			loadingBasicLocationRef.current = true;
			(async () => {
				const location = await getCurrentGeoLocation();
				setCachedLocation(location);
				dispatch({
					type: ACTION_LOCATION,
					payload: {
						location,
					},
				});
			})();
		}
		/**
		 * If we have the location cached in local storage but not in the state,
		 * we need to set it in the state.
		 */
		if (cachedLocation && cachedLocation.accuracy !== 0 && !state.location) {
			dispatch({
				type: ACTION_LOCATION,
				payload: {
					location: cachedLocation,
				},
			});
		}
	}, [isAuthenticated, cachedLocation, setCachedLocation, state.location]);

	/**
	 * Effect to fetch the detailed location of the user using the
	 * location service. This effect is dependent on the basic location
	 * (latitude, longitude) of the user.
	 */
	useEffect(() => {
		/**
		 * Basic location (latitude, longitude) is not available yet.
		 * We cannot request for detailed location yet.
		 */
		if (!state.location || state.location.accuracy === 0) {
			return;
		}

		/**
		 * We already have the detailed location.
		 * We do not need to request it again.
		 */
		if (state.location.city || state.location.displayName) {
			return;
		}

		/**
		 * We are already in the process of fetching the detailed location.
		 */
		if (loadingDetailedLocationRef.current) {
			return;
		}

		/**
		 * We are here because we have the basic location (latitude and
		 * longitude), but we do not have the detailed
		 * location (city, region, country or display name) yet.
		 */
		(async () => {
			loadingDetailedLocationRef.current = true;
			try {
				const response = await serviceCall({
					accessToken: await getAccessToken(),
					type: SERVICE_TYPES.GET_LOCATION,
					params: {
						latitude: cachedLocation.latitude,
						longitude: cachedLocation.longitude,
					},
				});
				loadingDetailedLocationRef.current = false;
				if (response.status !== 200 || response?.errors?.length > 0) {
					/**
					 * We could not fetch the location. We need to set the city to "N/A" to
					 * indicate that the location is not available, and prevents further
					 * requests to the location service, until the user refreshes the page or
					 * uses the reload button in the profile page.
					 */
					onLocationError();
				} else {
					dispatch({
						type: ACTION_LOCATION,
						payload: {
							location: {
								...cachedLocation,

								country: response?.data?.country,
								state: response?.data?.state,
								city: response?.data?.city || "N/A",
								displayName: response?.data?.displayName,
							},
						},
					});
				}
			} catch (_error) {
				/**
				 * We could not fetch the location. We need to set the city to "N/A" to
				 * indicate that the location is not available, and prevents further
				 * requests to the location service, until the user refreshes the page or
				 * uses the reload button in the profile page.
				 */
				onLocationError();
			}
		})();
	}, [state, cachedLocation, getAccessToken, onLocationError]);

	/**
	 * Effect to animate the logo and the app container when the app is loaded.
	 */
	useEffect(() => {
		document.getElementById("logo")?.classList.add("fadeOut");
		setTimeout(() => {
			document
				.getElementById("root")
				?.classList.replace("app-hidden", "fadeIn");
		}, 500);
	});

	return (
		<AppContext.Provider value={{ state, dispatch, serverStats }}>
			<HistoryContext.Provider
				value={{
					state: stateHistory,
					dispatch: dispatchHistory,
				}}
			>
				<Main>
					<MessagesContainer />
				</Main>
				<AppFooter serverStats={serverStats} />
			</HistoryContext.Provider>
		</AppContext.Provider>
	);
}

App.displayName = "App";
export default App;
