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
import { appReducer } from "../../common/reducers/appReducer";
import { historyReducer } from "../../common/reducers/historyReducer";
import { tagsReducer } from "../../common/reducers/tagsReducer";
import { SERVICE_TYPES, serviceCall } from "../../common/services";
import type { ServerStatsProps } from "../../common/types";
import { MessagesContainer } from "../Messages/MessagesContainer";
import { PromptInput } from "../Messages/PromptInput";
import { Toolbox } from "../Toolbox/Toolbox";
import { AppContext, HistoryContext, TagsContext } from "./AppContext";

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

	const [state, dispatch] = useReducer(appReducer, {
		id: uuidv4(),
		model: DEFAULT_AI_ENGINE,
		engine: DEFAULT_AI_ENGINE,
		usage: 0,
		messages: [],
		tags: [],
		isComponent,
	});
	const [stateHistory, dispatchHistory] = useReducer(historyReducer, {
		searchString: cachedSearchedString,
		sortedCell: "timestamp",
		sortDirection: cachedSortDirection,
	});
	const [stateTags, dispatchTags] = useReducer(tagsReducer, {
		tag: "",
		tags: [],
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
					{/* 118 (prompt + tags height) + 45 (buffer) = 163 */}
					<Main className="max-h-[calc(100svh_-_163px)]">
						<MessagesContainer />
					</Main>
					<div className="md:mx-auto md:max-w-4xl w-11/12 fixed bottom-10 left-1/2 transform -translate-x-1/2 z-1000">
						<Toolbox />
						<PromptInput />
					</div>
				</TagsContext.Provider>
			</HistoryContext.Provider>
		</AppContext.Provider>
	);
}

App.displayName = "App";
export default App;
