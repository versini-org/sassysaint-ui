import { useAuth } from "@versini/auth-provider";
import { useLocalStorage } from "@versini/ui-hooks";
import { Main } from "@versini/ui-main";
import { TableCellSortDirections } from "@versini/ui-table";
import { useEffect, useReducer, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
	ACTION_ENGINE,
	DEFAULT_AI_ENGINE,
	LOCAL_STORAGE_PREFIX,
	LOCAL_STORAGE_SEARCH,
	LOCAL_STORAGE_SORT,
} from "../../common/constants";
import { SERVICE_TYPES, serviceCall } from "../../common/services";
import type { ServerStatsProps } from "../../common/types";
import { AppFooter } from "../Footer/AppFooter";
import { MessagesContainer } from "../Messages/MessagesContainer";
import { AppContext, HistoryContext, TagsContext } from "./AppContext";
import { historyReducer, reducer, tagsReducer } from "./reducer";

function App({ isComponent = false }: { isComponent?: boolean }) {
	const loadingServerStatsRef = useRef(false);
	const { getAccessToken, user } = useAuth();
	const [cachedSearchedString] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_SEARCH,
		initialValue: "",
	});
	const [cachedSortDirection] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_SORT,
		initialValue: TableCellSortDirections.ASC,
	});

	const [state, dispatch] = useReducer(reducer, {
		id: uuidv4(),
		model: DEFAULT_AI_ENGINE,
		engine: DEFAULT_AI_ENGINE,
		usage: 0,
		messages: [],
		isComponent,
	});
	const [stateHistory, dispatchHistory] = useReducer(historyReducer, {
		searchString: cachedSearchedString,
		sortedCell: "timestamp",
		sortDirection: cachedSortDirection,
	});
	const [stateTags, dispatchTags] = useReducer(tagsReducer, {
		tag: "",
	});

	const [serverStats, setServerStats] = useState<ServerStatsProps>({
		version: "",
		models: [],
		plugins: [],
		engine: DEFAULT_AI_ENGINE,
		engines: [],
	});

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
					params: {
						user: user?.username,
					},
				});
				loadingServerStatsRef.current = false;

				if (response.status === 200) {
					setServerStats(response.data);
					dispatch({
						type: ACTION_ENGINE,
						payload: {
							engine: response.data.engine,
						},
					});
				}
			} catch (_error) {
				// nothing to declare officer
			}
		})();
	}, [serverStats, getAccessToken, user]);

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
				<TagsContext.Provider
					value={{ state: stateTags, dispatch: dispatchTags }}
				>
					<Main>
						<MessagesContainer />
					</Main>
					<AppFooter serverStats={serverStats} />
				</TagsContext.Provider>
			</HistoryContext.Provider>
		</AppContext.Provider>
	);
}

App.displayName = "App";
export default App;
