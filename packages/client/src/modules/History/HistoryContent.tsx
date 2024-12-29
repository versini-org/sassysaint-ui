import { useAuth } from "@versini/auth-provider";
import { Button } from "@versini/ui-button";
import { useLocalStorage } from "@versini/ui-hooks";
import { TableCellSortDirections } from "@versini/ui-table";
import { TextInput } from "@versini/ui-textinput";
import { useContext, useEffect, useRef, useState } from "react";

import {
	ACTION_SEARCH,
	LOCAL_STORAGE_PREFIX,
	LOCAL_STORAGE_SEARCH,
} from "../../common/constants";
import { SERVICE_TYPES, serviceCall } from "../../common/services";
import { debounce } from "../../common/utilities";
import { AppContext, HistoryContext } from "../App/AppContext";
import { HistoryTable } from "./HistoryTable";

type HistoryContentProps = {
	onOpenChange: any;
};

const filterDataByContent = async ({
	searchString,
	username,
	accessToken,
	direction = TableCellSortDirections.ASC,
}: {
	searchString: string;
	username?: string;
	accessToken: string;
	direction?:
		| typeof TableCellSortDirections.ASC
		| typeof TableCellSortDirections.DESC;
}) => {
	if (!username) {
		return [];
	}

	try {
		const response = await serviceCall({
			accessToken,
			type: SERVICE_TYPES.GET_CHATS,
			params: {
				userId: username,
				searchString,
				limit: 1,
				direction,
			},
		});
		if (response.status === 200) {
			return response.data;
		}
	} catch (_error) {
		return [];
	}

	return [];
};

export const HistoryContent = ({ onOpenChange }: HistoryContentProps) => {
	const { isAuthenticated, getAccessToken, user } = useAuth();
	const inputRef = useRef<HTMLInputElement>(null);
	const loadingInitialDataRef = useRef(false);

	const { dispatch } = useContext(AppContext);
	const { state: historyState, dispatch: historyDispatch } =
		useContext(HistoryContext);

	const [, setCachedSearchString] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_SEARCH,
		initialValue: historyState.searchString,
	});

	const [filteredHistory, setFilteredHistory] = useState<{
		data: any[];
		sortedDirection:
			| typeof TableCellSortDirections.ASC
			| typeof TableCellSortDirections.DESC;
	}>({
		data: [],
		sortedDirection: historyState.sortDirection,
	});

	const updateDataOnSearch = async (searchString: string) => {
		const accessToken = await getAccessToken();
		const filteredData = await filterDataByContent({
			searchString,
			username: user?.username,
			accessToken,
			direction: historyState.sortDirection,
		});
		setFilteredHistory({
			data: filteredData,
			sortedDirection: historyState.sortDirection,
		});
		setCachedSearchString(searchString);

		historyDispatch({
			type: ACTION_SEARCH,
			payload: { searchString },
		});
	};

	const onSearchChange = debounce((e: any) => {
		updateDataOnSearch(e.target.value);
	}, 500);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	useEffect(() => {
		if (loadingInitialDataRef.current) {
			return;
		}
		(async () => {
			loadingInitialDataRef.current = true;

			const accessToken = await getAccessToken();
			const filteredData = await filterDataByContent({
				searchString: historyState.searchString,
				username: user?.username,
				accessToken,
				direction: historyState.sortDirection,
			});
			setFilteredHistory({
				data: filteredData,
				sortedDirection: historyState.sortDirection,
			});
		})();
	});

	useEffect(() => {
		if (historyState.sortDirection !== filteredHistory.sortedDirection) {
			const sortedData = [...filteredHistory.data].sort((a, b) => {
				if (historyState.sortedCell === "timestamp") {
					const dateA = new Date(a[historyState.sortedCell]).getTime();
					const dateB = new Date(b[historyState.sortedCell]).getTime();
					return historyState.sortDirection === TableCellSortDirections.ASC
						? dateA - dateB
						: dateB - dateA;
				}
				return 0;
			});
			setFilteredHistory({
				data: sortedData,
				sortedDirection: historyState.sortDirection,
			});
		}
	}, [filteredHistory, historyState]);

	return isAuthenticated
		? filteredHistory && filteredHistory.data && (
				<>
					<form autoComplete="off" onSubmit={onSubmit}>
						<TextInput
							autoComplete="off"
							autoCorrect="off"
							ref={inputRef}
							defaultValue={historyState.searchString}
							focusMode="light"
							mode="dark"
							name="Search"
							label="Search"
							onChange={onSearchChange}
							className="mt-2 mb-2"
							{...(historyState.searchString && {
								rightElement: (
									<Button
										disabled={!historyState.searchString}
										mode="light"
										focusMode="light"
										noBorder
										size="small"
										onClick={() => {
											updateDataOnSearch("");
											if (inputRef.current?.value) {
												inputRef.current.value = "";
												inputRef.current.focus();
											}
										}}
									>
										Reset
									</Button>
								),
							})}
						/>
					</form>
					<div className="flex flex-col gap-2 sm:flex-row">
						<HistoryTable
							filteredHistory={filteredHistory}
							setFilteredHistory={setFilteredHistory}
							dispatch={dispatch}
							onOpenChange={onOpenChange}
						/>
					</div>
				</>
			)
		: null;
};
