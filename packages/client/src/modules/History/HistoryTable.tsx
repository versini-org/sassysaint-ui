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
import {
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

import {
	ACTION_RESET,
	ACTION_RESTORE,
	ACTION_SORT,
	INFINITE_SCROLL_LIMIT,
	INFINITE_SCROLL_THRESHOLD,
	LOCAL_STORAGE_PREFIX,
	LOCAL_STORAGE_SORT,
} from "../../common/constants";
import { SERVICE_TYPES, serviceCall } from "../../common/services";
import { CARDS } from "../../common/strings";
import { pluralize } from "../../common/utilities";
import { HistoryContext } from "../App/AppContext";
import { ConfirmationPanel } from "../Common/ConfirmationPanel";

type HistoryItemProps = {
	id: number;
	messages: { content: string }[];
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

export const HistoryTable = ({
	filteredHistory,
	setFilteredHistory,
	dispatch,
	onOpenChange,
}: {
	dispatch: any;
	filteredHistory: {
		data: any[];
		sortedDirection:
			| typeof TableCellSortDirections.ASC
			| typeof TableCellSortDirections.DESC;
	};
	onOpenChange: any;
	setFilteredHistory: any;
}) => {
	const { user, getAccessToken } = useAuth();
	const infinityScrollMarkerRef = useRef<HTMLTableRowElement>(null);
	const chatToDeleteRef = useRef({
		id: 0,
		timestamp: "",
		message: "",
	});
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [lastEntryToLoad, setLastEntryToLoad] = useState(
		INFINITE_SCROLL_LIMIT + INFINITE_SCROLL_THRESHOLD,
	);
	const { state: historyState, dispatch: historyDispatch } =
		useContext(HistoryContext);
	const [, setCachedSortDirection] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_SORT,
		initialValue: historyState.sortDirection,
	});

	const onClickSort = (key: string) => {
		switch (historyState.sortDirection) {
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
					limit: 1,
					searchString: historyState.searchString,
					direction: historyState.sortDirection,
					truncateSize: 100,
				},
			});

			if (response.status === 200) {
				setFilteredHistory({ data: response.data });
			}
		} catch (_error) {
			// nothing to declare officer
		}
	};

	const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
		const target = entries[0];
		if (target.isIntersecting) {
			setLastEntryToLoad((prev) => prev + INFINITE_SCROLL_LIMIT);
		}
	}, []);

	useEffect(() => {
		const option: IntersectionObserverInit = {
			// root: null,
			rootMargin: "20px",
		};
		const observer = new IntersectionObserver(handleObserver, option);
		if (infinityScrollMarkerRef.current) {
			observer.observe(infinityScrollMarkerRef.current);
		}
	});

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
						<TableCell className="sr-only">Row</TableCell>
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
					{filteredHistory.data
						.slice(0, lastEntryToLoad)
						.map((item: HistoryItemProps, idx: any) => {
							return item?.messages?.length > 0 ? (
								<Fragment key={`${CARDS.HISTORY.TITLE}-${item.id}-${idx}`}>
									{idx === lastEntryToLoad - INFINITE_SCROLL_THRESHOLD && (
										<tr ref={infinityScrollMarkerRef} />
									)}
									<TableRow>
										<TableCell>{idx + 1}</TableCell>
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
											{item.messages.length > 0
												? item.messages[0]?.content
												: ""}
										</TableCell>

										<TableCell
											component="th"
											scope="row"
											className="text-gray-400"
											align="center"
										>
											{item.model && item.model.startsWith("claude") && (
												<IconAnthropic size="size-4 sm:size-5" />
											)}
											{item.model && item.model.startsWith("gpt") && (
												<IconOpenAI size="size-4 sm:size-5" />
											)}
										</TableCell>

										<TableCell align="right">
											<ButtonIcon
												className="mr-2"
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
												<IconRestore size="size-3" monotone />
											</ButtonIcon>
											<ButtonIcon
												focusMode="alt-system"
												noBorder
												label="Delete chat"
												onClick={() => {
													chatToDeleteRef.current = {
														id: item.id,
														timestamp: item.timestamp,
														message:
															item.messages.length > 0
																? item.messages[0]?.content
																: "",
													};
													setShowConfirmation(!showConfirmation);
												}}
											>
												<div className="text-red-400">
													<IconDelete size="size-3" monotone />
												</div>
											</ButtonIcon>
										</TableCell>
									</TableRow>
								</Fragment>
							) : null;
						})}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell colSpan={1000}>
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
