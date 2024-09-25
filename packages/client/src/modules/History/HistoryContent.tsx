import { useAuth } from "@versini/auth-provider";
import { Button } from "@versini/ui-button";
import { useLocalStorage } from "@versini/ui-hooks";
import { TextInput } from "@versini/ui-textinput";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

import {
	ACTION_SEARCH,
	LOCAL_STORAGE_PREFIX,
	LOCAL_STORAGE_SEARCH,
} from "../../common/constants";
import { AppContext, HistoryContext } from "../App/AppContext";
import { HistoryTable } from "./HistoryTable";

type HistoryContentProps = {
	historyData: any[];
	onOpenChange: any;
};

function filterDataByContent(data: any, searchString: string) {
	if (!searchString) {
		return data;
	}
	return data.filter((item: { messages: any[] }) =>
		item.messages.some(
			(message) =>
				message.content !== null &&
				message.content.toLowerCase().includes(searchString.toLowerCase()),
		),
	);
}

export const HistoryContent = ({
	onOpenChange,
	historyData,
}: HistoryContentProps) => {
	const { isAuthenticated } = useAuth();
	const inputRef = useRef<HTMLInputElement>(null);

	const { dispatch } = useContext(AppContext);
	const { state: historyState, dispatch: historyDispatch } =
		useContext(HistoryContext);

	const [, setCachedSearchString] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_SEARCH,
		initialValue: historyState.searchString,
	});

	const fullHistory = useMemo(() => historyData, [historyData]);
	const [filteredHistory, setFilteredHistory] = useState<{
		data: any[];
	}>({
		data: fullHistory,
	});

	const updateDataOnSearch = (searchString: string) => {
		const filteredData = filterDataByContent(fullHistory, searchString);
		setFilteredHistory({
			data: filteredData,
		});
		setCachedSearchString(searchString);

		historyDispatch({
			type: ACTION_SEARCH,
			payload: { searchString },
		});
	};

	const onSearchChange = (e: any) => {
		updateDataOnSearch(e.target.value);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	useEffect(() => {
		const filteredData = filterDataByContent(
			historyData,
			historyState.searchString,
		);
		setFilteredHistory({
			data: filteredData,
		});
	}, [historyData, historyState.searchString]);

	return isAuthenticated
		? filteredHistory && filteredHistory.data && (
				<>
					<form autoComplete="off" onSubmit={onSubmit}>
						<TextInput
							ref={inputRef}
							defaultValue={historyState.searchString}
							focusMode="light"
							name="Search"
							label="Search"
							onChange={onSearchChange}
							spacing={{ t: 2, b: 2 }}
							{...(historyState.searchString && {
								rightElement: (
									<Button
										disabled={!historyState.searchString}
										mode="dark"
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
