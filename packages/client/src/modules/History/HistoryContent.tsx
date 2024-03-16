import {
	ButtonIcon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@versini/ui-components";
import { TextInput } from "@versini/ui-form";
import { IconDelete, IconRestore } from "@versini/ui-icons";
import { useContext, useRef, useState } from "react";

import { ACTION_RESET, ACTION_RESTORE } from "../../common/constants";
import { GRAPHQL_QUERIES, graphQLCall } from "../../common/services";
import { CARDS, FAKE_USER_EMAIL, FAKE_USER_NAME } from "../../common/strings";
import { truncate } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

type HistoryContentProps = {
	historyData: any[];
	isAuthenticated: boolean;
	isDev: boolean;
	onOpenChange: any;
	user: any;
};

type HistoryItemProps = {
	id: number;
	messages: [];
	model: string;
	timestamp: string;
	usage: number;
	user: string;
};

const onClickRestore = async (
	item: HistoryItemProps,
	dispatch: any,
	onOpenChange: any,
) => {
	try {
		const response = await graphQLCall({
			query: GRAPHQL_QUERIES.GET_CHAT,
			data: {
				id: item.id,
			},
		});

		if (response.status === 200) {
			const data = await response.json();
			dispatch({
				type: ACTION_RESET,
			});
			dispatch({
				type: ACTION_RESTORE,
				payload: {
					id: item.id,
					model: data.data.chatById.model,
					usage: data.data.chatById.usage,
					messages: data.data.chatById.messages,
				},
			});
			// close the panel
			onOpenChange(false);
		}
	} catch (error) {
		// nothing to declare officer
	}
};

const onClickDelete = async (
	item: { id: any },
	setFilteredHistory: (arg0: any) => void,
	setFullHistory: (arg0: any) => void,
	inputRef: any,
	endUser: any,
) => {
	try {
		const response = await graphQLCall({
			query: GRAPHQL_QUERIES.DELETE_CHAT,
			data: {
				userId: endUser?.email || FAKE_USER_EMAIL,
				id: item?.id,
			},
		});
		if (response.status === 200) {
			const data = await response.json();
			setFullHistory(data.data.deleteChat);
			setFilteredHistory({ data: data.data.deleteChat, searchString: "" });
			if (inputRef?.current) {
				inputRef.current.value = "";
			}
		}
	} catch (error) {
		// nothing to declare officer
	}
};

const extractFirstUserMessage = (messages: any[]) => {
	const message = messages[0];
	return truncate(message?.content, 100);
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

const renderAsTable = (
	filteredHistory: any,
	setFilteredHistory: any,
	setFullHistory: any,
	dispatch: any,
	onOpenChange: any,
	inputRef: any,
	endUser: any,
) => {
	const data = filteredHistory.data;
	return (
		<Table stickyHeader wrapperClassName="max-h-[60vh]">
			<TableHead>
				<TableRow>
					<TableCell className="uppercase text-white">Date</TableCell>
					<TableCell className="uppercase text-white">First message</TableCell>
					<TableCell className="text-right uppercase text-white">
						Actions
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{data.map((item: HistoryItemProps, idx: any) => {
					return item?.messages?.length > 0 ? (
						<TableRow key={`${CARDS.HISTORY.TITLE}-${item.id}-${idx}`}>
							<TableCell
								component="th"
								scope="row"
								className="font-medium text-gray-400 sm:whitespace-nowrap"
							>
								{item.timestamp}
							</TableCell>
							<TableCell className="max-w-[100px] text-white sm:max-w-full">
								{extractFirstUserMessage(item.messages)}
							</TableCell>

							<TableCell>
								<div className="flex justify-end gap-2">
									<ButtonIcon
										focusMode="alt-system"
										noBorder
										label="Restore chat"
										onClick={() => {
											onClickRestore(item, dispatch, onOpenChange);
										}}
									>
										<IconRestore className="h-3 w-3" monotone />
									</ButtonIcon>
									<ButtonIcon
										focusMode="alt-system"
										noBorder
										label="Delete chat"
										onClick={() => {
											onClickDelete(
												item,
												setFilteredHistory,
												setFullHistory,
												inputRef,
												endUser,
											);
										}}
									>
										<div className="text-red-400">
											<IconDelete className="h-3 w-3" monotone />
										</div>
									</ButtonIcon>
								</div>
							</TableCell>
						</TableRow>
					) : null;
				})}
			</TableBody>
		</Table>
	);
};

export const HistoryContent = ({
	isAuthenticated,
	isDev,
	user,
	onOpenChange,
	historyData,
}: HistoryContentProps) => {
	const [fullHistory, setFullHistory] = useState<any[]>(historyData);
	const [filteredHistory, setFilteredHistory] = useState<{
		data: any[];
		searchString: string;
	}>({
		data: fullHistory,
		searchString: "",
	});
	const inputRef = useRef<HTMLInputElement>(null);
	const { dispatch } = useContext(AppContext);
	const endUser = isDev
		? { name: FAKE_USER_NAME, email: FAKE_USER_EMAIL }
		: user;

	const onSearchChange = (e: any) => {
		const searchString = e.target.value;
		const filteredData = filterDataByContent(fullHistory, searchString);
		setFilteredHistory({ searchString, data: filteredData });
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (isAuthenticated && endUser) || isDev
		? filteredHistory && filteredHistory.data && (
				<>
					<div className="text-md text-center">
						{filteredHistory.data.length}{" "}
						{`chat${filteredHistory.data.length === 1 ? "" : "s"}`}
					</div>
					<form autoComplete="off" onSubmit={onSubmit}>
						<TextInput
							focusMode="light"
							ref={inputRef}
							name="Search"
							label="Search"
							onChange={onSearchChange}
							spacing={{ t: 2, b: 2 }}
						/>
					</form>
					<div className="flex flex-col gap-2 sm:flex-row">
						{renderAsTable(
							filteredHistory,
							setFilteredHistory,
							setFullHistory,
							dispatch,
							onOpenChange,
							inputRef,
							endUser,
						)}
					</div>
				</>
			)
		: null;
};
