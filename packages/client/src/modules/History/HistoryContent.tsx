import { TextInput } from "@versini/ui-form";
import { useContext, useRef, useState } from "react";

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
	const { state: historyState, dispatch: historyDispatch } =
		useContext(HistoryContext);
	console.log(
		`==> [${Date.now()}] historyState.searchString: `,
		historyState.searchString,
	);

	const [fullHistory, setFullHistory] = useState<any[]>(historyData);
	const [filteredHistory, setFilteredHistory] = useState<{
		data: any[];
		searchString: string;
	}>({
		data: fullHistory,
		searchString: historyState.searchString,
	});
	const inputRef = useRef<HTMLInputElement>(null);
	const { dispatch } = useContext(AppContext);

	const endUser = isDev
		? { name: FAKE_USER_NAME, email: FAKE_USER_EMAIL }
		: user;

	const filteredData = filterDataByContent(
		fullHistory,
		historyState.searchString,
	);
	setFilteredHistory({
		searchString: historyState.searchString,
		data: filteredData,
	});

	const onSearchChange = (e: any) => {
		const searchString = e.target.value;
		const filteredData = filterDataByContent(fullHistory, searchString);
		setFilteredHistory({ searchString, data: filteredData });
		historyDispatch({
			type: "SEARCH",
			payload: { searchString },
		});
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (isAuthenticated && endUser) || isDev
		? filteredHistory && filteredHistory.data && (
				<>
					<form autoComplete="off" onSubmit={onSubmit}>
						<TextInput
							defaultValue={historyState.searchString}
							focusMode="light"
							ref={inputRef}
							name="Search"
							label="Search"
							onChange={onSearchChange}
							spacing={{ t: 2, b: 2 }}
						/>
					</form>
					<div className="flex flex-col gap-2 sm:flex-row">
						<HistoryTable
							filteredHistory={filteredHistory}
							setFilteredHistory={setFilteredHistory}
							setFullHistory={setFullHistory}
							dispatch={dispatch}
							onOpenChange={onOpenChange}
							inputRef={inputRef}
							endUser={endUser}
						/>
					</div>
				</>
			)
		: null;
};
