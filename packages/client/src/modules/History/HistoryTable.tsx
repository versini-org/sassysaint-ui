import {
	ButtonIcon,
	Table,
	TableBody,
	TableCell,
	TableCellSort,
	TableCellSortDirections,
	TableFooter,
	TableHead,
	TableRow,
} from "@versini/ui-components";
import { IconDelete, IconRestore } from "@versini/ui-icons";
import { useState } from "react";

import { ACTION_RESET, ACTION_RESTORE } from "../../common/constants";
import { GRAPHQL_QUERIES, graphQLCall } from "../../common/services";
import { CARDS, FAKE_USER_EMAIL } from "../../common/strings";
import { truncate } from "../../common/utilities";

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

export const HistoryTable = ({
	filteredHistory,
	setFilteredHistory,
	setFullHistory,
	dispatch,
	onOpenChange,
	inputRef,
	endUser,
}: {
	dispatch: any;
	endUser: any;
	filteredHistory: any;
	inputRef: any;
	onOpenChange: any;
	setFilteredHistory: any;
	setFullHistory: any;
}) => {
	const [sortState, setSortState] = useState<{
		cell: string;
		direction:
			| typeof TableCellSortDirections.ASC
			| typeof TableCellSortDirections.DESC
			| false;
	}>({ direction: TableCellSortDirections.ASC, cell: "timestamp" });

	const data = filteredHistory.data.sort(
		(
			a: { [x: string]: string | number | Date },
			b: { [x: string]: string | number | Date },
		) => {
			switch (sortState.cell) {
				case "timestamp":
					if (sortState.direction === TableCellSortDirections.ASC) {
						return (
							new Date(a[sortState.cell]).getTime() -
							new Date(b[sortState.cell]).getTime()
						);
					} else if (sortState.direction === TableCellSortDirections.DESC) {
						return (
							new Date(b[sortState.cell]).getTime() -
							new Date(a[sortState.cell]).getTime()
						);
					}
					break;

				default:
					return 0;
			}
			return 0;
		},
	);

	const onClickSort = (key: string) => {
		switch (sortState.direction) {
			case false:
				setSortState({ cell: key, direction: TableCellSortDirections.ASC });
				break;
			case TableCellSortDirections.ASC:
				setSortState({ cell: key, direction: TableCellSortDirections.DESC });
				break;
			default:
				setSortState({ cell: key, direction: TableCellSortDirections.ASC });
				break;
		}
	};

	return (
		<Table stickyHeader stickyFooter wrapperClassName="max-h-[60vh]">
			<TableHead>
				<TableRow>
					<TableCell className="sr-only">Row</TableCell>
					<TableCellSort
						cellId="timestamp"
						align="left"
						sortDirection={sortState.direction}
						sortedCell={sortState.cell}
						onClick={() => {
							onClickSort("timestamp");
						}}
					>
						Date
					</TableCellSort>
					<TableCell>First message</TableCell>
					<TableCell className="text-right">Actions</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{data.map((item: HistoryItemProps, idx: any) => {
					return item?.messages?.length > 0 ? (
						<TableRow key={`${CARDS.HISTORY.TITLE}-${item.id}-${idx}`}>
							<TableCell>{idx + 1}</TableCell>
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
			<TableFooter>
				<TableRow>
					<TableCell colSpan={4}>
						<div>
							{filteredHistory.data.length}{" "}
							{`chat${filteredHistory.data.length === 1 ? "" : "s"}`}
						</div>
					</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
};
