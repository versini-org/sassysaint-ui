import { useAuth } from "@versini/auth-provider";
import { Header } from "@versini/ui-header";
import { useLocalStorage } from "@versini/ui-hooks";
import { Main } from "@versini/ui-main";
import { TableCellSortDirections } from "@versini/ui-table";
import { Suspense, lazy, useEffect, useReducer, useRef, useState } from "react";
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
import { getMainPaddingClass } from "../../common/utilities";
import { Footer } from "../Footer/Footer";
import { MessagesContainer } from "../Messages/MessagesContainer";
import { AppContext, HistoryContext, TagsContext } from "./AppContext";

const HeaderToolbar = lazy(
	() => import(/* webpackChunkName: "LazyHeader" */ "../Header/HeaderToolbar"),
);

function App({ isComponent = false }: { isComponent?: boolean }) {
	const loadingServerStatsRef = useRef(false);
	const { getAccessToken, user, isAuthenticated } = useAuth();
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

	/**
	 * We need to set the main tag height depending on other elements:
	 * - footer (including the input and tags): 118px + 10px (fixed position) = 128px
	 * - header: 64px + 20px margin top = 84px
	 * - buffer: 48px
	 * - total: 128px + 84px + 38px = 250px
	 */
	const mainClassName = "max-h-[calc(100svh_-_250px)]";

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
					<Header
						noColors
						noMargin
						noPadding
						noBorder
						className={getMainPaddingClass({
							extraClass: "mt-5",
						})}
					>
						{isAuthenticated && (
							<Suspense fallback={<div />}>
								<HeaderToolbar />
							</Suspense>
						)}
					</Header>
					<Main
						className={getMainPaddingClass({
							extraClass: mainClassName,
						})}
						noMargin
						noPadding
					>
						<MessagesContainer />
					</Main>
					<Footer />
				</TagsContext.Provider>
			</HistoryContext.Provider>
		</AppContext.Provider>
	);
}

App.displayName = "App";
export default App;
