import {
	ButtonIcon,
	IconDelete,
	IconRestore,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextInput,
} from "@versini/ui-components";
import { useContext, useEffect, useState } from "react";

import { ACTION_RESET, ACTION_RESTORE } from "../../common/constants";
import { serviceCall } from "../../common/services";
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
	dispatch({
		type: ACTION_RESET,
	});

	dispatch({
		type: ACTION_RESTORE,
		payload: {
			id: item.id,
			model: item.model,
			usage: item.usage,
			messages: item.messages,
		},
	});
	// close the panel
	onOpenChange(false);
};

const onClickDelete = async (
	item: { id: any; user: any },
	setHistory: (arg0: any) => void,
) => {
	try {
		const response = await serviceCall({
			name: "delete",
			data: {
				user: item?.user,
				id: item?.id,
			},
		});
		if (response.status === 200) {
			const data = await response.json();
			setHistory(data);
		}
	} catch (error) {
		// nothing to declare officer
	}
};

const extractFirstUserMessage = (messages: any[]) => {
	const message = messages.find((item) => item.role === "user");
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
	data: any[],
	setHistory: any,
	dispatch: any,
	onOpenChange: any,
) => {
	return (
		<Table stickyHeader maxHeight="75vh">
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
							<TableCell className="text-white">
								{extractFirstUserMessage(item.messages)}
							</TableCell>

							<TableCell>
								<div className="flex justify-end gap-2">
									<ButtonIcon
										noBorder
										label="Restore chat"
										kind="light"
										onClick={() => {
											onClickRestore(item, dispatch, onOpenChange);
										}}
									>
										<IconRestore className="h-3 w-3" monotone />
									</ButtonIcon>
									<ButtonIcon
										noBorder
										label="Delete chat"
										kind="light"
										onClick={() => {
											onClickDelete(item, setHistory);
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
	const [history, setHistory] = useState<any[]>(historyData);
	const [filteredHistory, setFilteredHistory] = useState<any[]>(historyData);
	const { state, dispatch } = useContext(AppContext);
	const endUser = isDev
		? { name: FAKE_USER_NAME, email: FAKE_USER_EMAIL }
		: user;

	useEffect(() => {
		(async () => {
			// we already have the data or there is no state
			if (!state || history.length > 0) {
				return;
			}

			try {
				const response = await serviceCall({
					name: "chats",
					data: {
						messages: state.messages,
						model: state.model,
						user: user?.email || FAKE_USER_EMAIL,
						id: state.id,
					},
				});

				if (response.status === 200) {
					const data = await response.json();
					setHistory(data.messages);
				}
			} catch (error) {
				// nothing to declare officer
			}
		})();
	}, [history.length, state, user?.email]);

	const onSearchChange = (e: any) => {
		const searchString = e.target.value;
		const filteredData = filterDataByContent(history, searchString);
		setFilteredHistory(filteredData);
	};

	return (isAuthenticated && endUser) || isDev
		? filteredHistory && (
				<>
					<div className="text-md text-center">
						{filteredHistory.length}{" "}
						{`chat${filteredHistory.length === 1 ? "" : "s"}`}
					</div>
					<TextInput
						name="Search"
						label="Search"
						onChange={onSearchChange}
						spacing={{ t: 2, b: 2 }}
					/>
					<div className="flex flex-col gap-2 sm:flex-row">
						{renderAsTable(filteredHistory, setHistory, dispatch, onOpenChange)}
					</div>
				</>
			)
		: null;
};
