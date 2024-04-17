import { Button } from "@versini/ui-components";
import { TextInput } from "@versini/ui-form";
import { useLocalStorage } from "@versini/ui-hooks";
import { useContext, useEffect, useRef, useState } from "react";

import {
	ACTION_SEARCH,
	LOCAL_STORAGE_PREFIX,
	LOCAL_STORAGE_SEARCH,
} from "../../common/constants";
import { FAKE_USER_EMAIL, FAKE_USER_NAME } from "../../common/strings";
import { AppContext, HistoryContext } from "../App/AppContext";
import { HistoryTable } from "./HistoryTable";

type HistoryContentProps = {
	historyData: any[];
	isAuthenticated: boolean;
	isDev: boolean;
	onOpenChange: any;
	user: any;
};

function filterDataByContent(data: any, searchString: string) {
	return data.filter((item: { messages: any[] }) =>
		item.messages.some(
			(message) =>
				message.content !== null &&
				message.content.toLowerCase().includes(searchString.toLowerCase()),
		),
	);
}

export const HistoryContent = ({
	isAuthenticated,
	isDev,
	user,
	onOpenChange,
	historyData,
}: HistoryContentProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const { dispatch } = useContext(AppContext);
	const { state: historyState, dispatch: historyDispatch } =
		useContext(HistoryContext);

	const [, setCachedSearchString] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_SEARCH,
		defaultValue: historyState.searchString,
	});

	const [fullHistory, setFullHistory] = useState<any[]>(historyData);
	const [filteredHistory, setFilteredHistory] = useState<{
		data: any[];
	}>({
		data: fullHistory,
	});

	const endUser = isDev
		? { name: FAKE_USER_NAME, email: FAKE_USER_EMAIL }
		: user;

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
			fullHistory,
			historyState.searchString,
		);
		setFilteredHistory({
			data: filteredData,
		});
	}, [fullHistory, historyState.searchString]);

	return (isAuthenticated && endUser) || isDev
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
							rightElement={
								<Button
									mode="light"
									noBorder
									size="small"
									onClick={() => {
										updateDataOnSearch("");
										if (inputRef.current?.value) {
											inputRef.current.value = "";
										}
									}}
								>
									Reset
								</Button>
							}
						/>
					</form>
					<div className="flex flex-col gap-2 sm:flex-row">
						<HistoryTable
							filteredHistory={filteredHistory}
							setFilteredHistory={setFilteredHistory}
							setFullHistory={setFullHistory}
							dispatch={dispatch}
							onOpenChange={onOpenChange}
							endUser={endUser}
						/>
					</div>
				</>
			)
		: null;
};
