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
import { useLocalStorage } from "@versini/ui-hooks";
import { IconDelete, IconRestore } from "@versini/ui-icons";
import { useContext } from "react";
import { useMedia } from "react-use";

import {
	ACTION_RESET,
	ACTION_RESTORE,
	ACTION_SORT,
	LOCAL_STORAGE_PREFIX,
	LOCAL_STORAGE_SORT,
} from "../../common/constants";
import { GRAPHQL_QUERIES, graphQLCall } from "../../common/services";
import { CARDS, FAKE_USER_EMAIL } from "../../common/strings";
import { truncate } from "../../common/utilities";
import { HistoryContext } from "../App/AppContext";

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
			setFilteredHistory({ data: data.data.deleteChat });
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
	endUser,
}: {
	dispatch: any;
	endUser: any;
	filteredHistory: any;
	onOpenChange: any;
	setFilteredHistory: any;
	setFullHistory: any;
}) => {
	const isWide = useMedia("(min-width: 480px)");
	const { state: historyState, dispatch: historyDispatch } =
		useContext(HistoryContext);
	const [, setCachedSortDirection] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_SORT,
		defaultValue: historyState.sortDirection,
	});

	const data = filteredHistory.data.sort(
		(
			a: { [x: string]: string | number | Date },
			b: { [x: string]: string | number | Date },
		) => {
			switch (historyState.sortedCell) {
				case "timestamp":
					if (historyState.sortDirection === TableCellSortDirections.ASC) {
						return (
							new Date(a[historyState.sortedCell]).getTime() -
							new Date(b[historyState.sortedCell]).getTime()
						);
					} else if (
						historyState.sortDirection === TableCellSortDirections.DESC
					) {
						return (
							new Date(b[historyState.sortedCell]).getTime() -
							new Date(a[historyState.sortedCell]).getTime()
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
		switch (historyState.sortDirection) {
			case false:
				setCachedSortDirection(TableCellSortDirections.ASC);
				historyDispatch({
					type: ACTION_SORT,
					payload: {
						sortedCell: key,
						sortDirection: TableCellSortDirections.ASC,
					},
				});
				break;
			case TableCellSortDirections.ASC:
				setCachedSortDirection(TableCellSortDirections.DESC);
				historyDispatch({
					type: ACTION_SORT,
					payload: {
						sortedCell: key,
						sortDirection: TableCellSortDirections.DESC,
					},
				});
				break;
			default:
				setCachedSortDirection(TableCellSortDirections.ASC);
				historyDispatch({
					type: ACTION_SORT,
					payload: {
						sortedCell: key,
						sortDirection: TableCellSortDirections.ASC,
					},
				});
				break;
		}
	};

	return (
		<Table stickyHeader stickyFooter wrapperClassName="max-h-[60vh]">
			<TableHead>
				<TableRow>
					{isWide && <TableCell className="sr-only">Row</TableCell>}
					<TableCellSort
						cellId="timestamp"
						align="left"
						sortDirection={historyState.sortDirection}
						sortedCell={historyState.sortedCell}
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
							{isWide && <TableCell>{idx + 1}</TableCell>}
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
