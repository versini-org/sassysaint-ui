import { useAuth0 } from "@auth0/auth0-react";
import { Button, Main, TableCellSortDirections } from "@versini/ui-components";
import { useLocalStorage } from "@versini/ui-hooks";
import { useEffect, useReducer, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
	ACTION_LOCATION,
	LOCAL_STORAGE_PREFIX,
	LOCAL_STORAGE_SEARCH,
	LOCAL_STORAGE_SORT,
	MODEL_GPT4,
} from "../../common/constants";
import { GRAPHQL_QUERIES, graphQLCall } from "../../common/services";
import { LOG_IN } from "../../common/strings";
import type { ServerStatsProps } from "../../common/types";
import {
	getCurrentGeoLocation,
	getMessageContaintWrapperClass,
	isDev,
	isProd,
} from "../../common/utilities";
import { AppFooter } from "../Footer/Footer";
import { MessagesContainer } from "../Messages/MessagesContainer";
import { MessagesContainerHeader } from "../Messages/MessagesContainerHeader";
import { AppContext, HistoryContext } from "./AppContext";
import { historyReducer, reducer } from "./reducer";

function App() {
	const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
	const [cachedSearchedString] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_SEARCH,
		defaultValue: "",
	});
	const [cachedSortDirection] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_SORT,
		defaultValue: TableCellSortDirections.ASC,
	});
	const locationRef = useRef({
		latitude: 0,
		longitude: 0,
		accuracy: 0,
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

		if (!locationRef.current || locationRef.current.accuracy === 0) {
			(async () => {
				locationRef.current = await getCurrentGeoLocation();
				dispatch({
					type: ACTION_LOCATION,
					payload: {
						location: locationRef.current,
					},
				});
			})();
		}
	}, [isAuthenticated, isLoading]);

	useEffect(() => {
		/**
		 * Basic location is not available yet.
		 * We cannot request for detailed location yet.
		 */
		if (!state.location) {
			return;
		}

		/**
		 * We already have the detailed location.
		 * We do not need to request it again.
		 */
		if (state.location.city) {
			return;
		}

		(async () => {
			try {
				const response = await graphQLCall({
					query: GRAPHQL_QUERIES.GET_LOCATION,
					data: {
						latitude: locationRef.current.latitude,
						longitude: locationRef.current.longitude,
					},
				});

				if (response.status === 200) {
					const res = await response.json();
					dispatch({
						type: ACTION_LOCATION,
						payload: {
							location: {
								...locationRef.current,
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
	}, [state]);

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

	if (!isAuthenticated && isProd) {
		return (
			<>
				<Main>
					<div className={getMessageContaintWrapperClass(isAuthenticated)}>
						<MessagesContainerHeader />
					</div>
					<Button
						mode="dark"
						focusMode="light"
						noBorder
						className="mb-4 mt-6"
						onClick={() => loginWithRedirect()}
					>
						{LOG_IN}
					</Button>
				</Main>
				<AppFooter serverStats={serverStats} />
			</>
		);
	}

	return isLoading && !isDev ? null : (
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
