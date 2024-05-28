import { useAuth0 } from "@auth0/auth0-react";
import { Main, TableCellSortDirections } from "@versini/ui-components";
import { useLocalStorage } from "@versini/ui-hooks";
import { useEffect, useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
	ACTION_LOCATION,
	LOCAL_STORAGE_LOCATION,
	LOCAL_STORAGE_PREFIX,
	LOCAL_STORAGE_SEARCH,
	LOCAL_STORAGE_SORT,
	MODEL_GPT4,
} from "../../common/constants";
import { GRAPHQL_QUERIES, graphQLCall } from "../../common/services";
import type { ServerStatsProps } from "../../common/types";
import { getCurrentGeoLocation, isDev } from "../../common/utilities";
import { AppFooter } from "../Footer/AppFooter";
import { MessagesContainer } from "../Messages/MessagesContainer";
import { AppContext, HistoryContext } from "./AppContext";
import { historyReducer, reducer } from "./reducer";

function App() {
	const { isLoading, isAuthenticated } = useAuth0();
	const [cachedSearchedString] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_SEARCH,
		defaultValue: "",
	});
	const [cachedSortDirection] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_SORT,
		defaultValue: TableCellSortDirections.ASC,
	});
	const [cachedLocation, setCachedLocation] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_LOCATION,
		defaultValue: { latitude: 0, longitude: 0, accuracy: 0 },
	});

	const [state, dispatch] = useReducer(reducer, {
		id: uuidv4(),
		model: MODEL_GPT4,
		usage: 0,
		messages: [],
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

	useEffect(() => {
		if (serverStats.version !== "") {
			// We already have the server stats.
			return;
		}
		(async () => {
			try {
				const response = await graphQLCall({
					query: GRAPHQL_QUERIES.ABOUT,
					data: {},
				});

				if (response.status === 200) {
					const data = await response.json();
					setServerStats(data.data.about);
				}
			} catch (_error) {
				// nothing to declare officer
			}
		})();
	}, [serverStats]);

	useEffect(() => {
		/**
		 * The user is in the process of being authenticated.
		 * We cannot request for location yet, unless we are in dev mode.
		 */
		if (!isDev && (!isAuthenticated || isLoading)) {
			return;
		}

		if (!cachedLocation || cachedLocation.accuracy === 0) {
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
		} else if (cachedLocation.accuracy > 0) {
			dispatch({
				type: ACTION_LOCATION,
				payload: {
					location: cachedLocation,
				},
			});
		}
	}, [isAuthenticated, isLoading, cachedLocation, setCachedLocation]);

	useEffect(() => {
		/**
		 * Basic location is not available yet.
		 * We cannot request for detailed location yet.
		 */
		if (!state.location || state.location.accuracy === 0) {
			return;
		}

		/**
		 * We already have the detailed location.
		 * We do not need to request it again.
		 */
		if (state.location.city) {
			return;
		}

		/**
		 * We are here because we have the basic location (latitude and longitude).
		 * We need to request for the detailed location.
		 */
		(async () => {
			try {
				const response = await graphQLCall({
					query: GRAPHQL_QUERIES.GET_LOCATION,
					data: {
						latitude: cachedLocation.latitude,
						longitude: cachedLocation.longitude,
					},
				});

				if (response.status === 200) {
					const res = await response.json();
					dispatch({
						type: ACTION_LOCATION,
						payload: {
							location: {
								...cachedLocation,
								city: res?.data?.location?.city,
								region: res?.data?.location?.region,
								regionShort: res?.data?.location?.regionShort,
								country: res?.data?.location?.country,
								countryShort: res?.data?.location?.countryShort,
							},
						},
					});
				}
			} catch (_error) {
				// nothing to declare officer
			}
		})();
	}, [state, cachedLocation]);

	useEffect(() => {
		if (isLoading && !isDev) {
			return;
		}
		document.getElementById("logo")?.classList.add("fadeOut");
		setTimeout(() => {
			document
				.getElementById("root")
				?.classList.replace("app-hidden", "fadeIn");
		}, 500);
	}, [isLoading]);

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
