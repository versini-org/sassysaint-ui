import { useAuth } from "@versini/auth-provider";
import { ButtonIcon } from "@versini/ui-button";
import { useLocalStorage } from "@versini/ui-hooks";
import { IconDelete, IconRestore } from "@versini/ui-icons";
import { IconAnthropic, IconOpenAI } from "@versini/ui-icons";
import {
	Table,
	TableBody,
	TableCell,
	TableCellSort,
	TableCellSortDirections,
	TableFooter,
	TableHead,
	TableRow,
} from "@versini/ui-table";
import { useContext, useRef, useState } from "react";

import { Flexgrid } from "@versini/ui-system";
import {
	ACTION_RESET,
	ACTION_RESTORE,
	ACTION_SORT,
	LOCAL_STORAGE_PREFIX,
	LOCAL_STORAGE_SORT,
} from "../../common/constants";
import { SERVICE_TYPES, serviceCall } from "../../common/services";
import { CARDS } from "../../common/strings";
import { pluralize, truncate } from "../../common/utilities";
import { HistoryContext } from "../App/AppContext";
import { ConfirmationPanel } from "../Common/ConfirmationPanel";

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
	accessToken: string,
) => {
	try {
		const response = await serviceCall({
			accessToken,
			type: SERVICE_TYPES.GET_CHAT,
			params: {
				id: item.id,
			},
		});

		if (response.status === 200) {
			dispatch({
				type: ACTION_RESET,
			});
			dispatch({
				type: ACTION_RESTORE,
				payload: {
					id: item.id,
					model: response.data.model,
					usage: response.data.usage,
					messages: response.data.messages,
				},
			});
			// close the panel
			onOpenChange(false);
		}
	} catch (_error) {
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
	dispatch,
	onOpenChange,
}: {
	dispatch: any;
	filteredHistory: any;
	onOpenChange: any;
	setFilteredHistory: any;
}) => {
	const { user, getAccessToken } = useAuth();
	const chatToDeleteRef = useRef({
		id: 0,
		timestamp: "",
		message: "",
	});
	const [showConfirmation, setShowConfirmation] = useState(false);
	const { state: historyState, dispatch: historyDispatch } =
		useContext(HistoryContext);
	const [, setCachedSortDirection] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_SORT,
		initialValue: historyState.sortDirection,
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

	const onClickDelete = async () => {
		const item = chatToDeleteRef.current;
		try {
			const response = await serviceCall({
				accessToken: await getAccessToken(),
				type: SERVICE_TYPES.DELETE_CHAT,
				params: {
					userId: user?.username || "",
					id: item.id,
				},
			});

			if (response.status === 200) {
				setFilteredHistory({ data: response.data });
			}
		} catch (_error) {
			// nothing to declare officer
		}
	};

	return (
		<>
			<ConfirmationPanel
				showConfirmation={showConfirmation}
				setShowConfirmation={setShowConfirmation}
				action={onClickDelete}
				customStrings={{
					confirmAction: "Delete",
					cancelAction: "Cancel",
					title: "Delete chat",
				}}
			>
				<p className="m-0">
					Are you sure you want to delete the following chat:
				</p>
				<ul className="m-0">
					<li>
						Timestamp:{" "}
						<span className="text-lg">
							{chatToDeleteRef.current && chatToDeleteRef.current.timestamp}
						</span>
					</li>
					<li>
						First message:{" "}
						<span className="text-lg">{chatToDeleteRef.current?.message}</span>
					</li>
				</ul>
			</ConfirmationPanel>
			<Table
				stickyHeader
				stickyFooter
				compact
				wrapperClassName="max-h-[60vh] min-h-[60vh]"
			>
				<TableHead>
					<TableRow>
						<TableCellSort
							buttonClassName="text-xs sm:text-sm"
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
						<TableCell className="text-xs sm:text-sm">First message</TableCell>
						<TableCell className="text-xs sm:text-sm">Model</TableCell>
						<TableCell className="text-xs sm:text-sm text-right">
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
									className="text-gray-400 sm:whitespace-nowrap text-xs sm:text-sm max-w-20 sm:max-w-none"
								>
									{item.timestamp}
								</TableCell>
								<TableCell
									className="max-w-[100px] text-white sm:max-w-full text-xs sm:text-sm"
									style={{
										wordBreak: "break-word",
									}}
								>
									{extractFirstUserMessage(item.messages)}
								</TableCell>

								<TableCell component="th" scope="row" className="text-gray-400">
									<Flexgrid alignHorizontal="center">
										{item.model && item.model.startsWith("claude") && (
											<IconAnthropic className="size-4 sm:size-5" />
										)}
										{item.model && item.model.startsWith("gpt") && (
											<IconOpenAI className="size-4 sm:size-5" />
										)}
									</Flexgrid>
								</TableCell>

								<TableCell className="px-2">
									<div className="flex justify-end gap-2">
										<ButtonIcon
											focusMode="alt-system"
											noBorder
											label="Restore chat"
											onClick={async () => {
												const accessToken = await getAccessToken();
												onClickRestore(
													item,
													dispatch,
													onOpenChange,
													accessToken,
												);
											}}
										>
											<IconRestore className="h-3 w-3" monotone />
										</ButtonIcon>
										<ButtonIcon
											focusMode="alt-system"
											noBorder
											label="Delete chat"
											onClick={() => {
												chatToDeleteRef.current = {
													id: item.id,
													timestamp: item.timestamp,
													message: extractFirstUserMessage(item.messages),
												};
												setShowConfirmation(!showConfirmation);
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
								{pluralize(
									`${filteredHistory.data.length} chat`,
									filteredHistory.data.length,
								)}
							</div>
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</>
	);
};
