import {
	ButtonIcon,
	IconDelete,
	IconRestore,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@versini/ui-components";
import { useContext, useEffect, useState } from "react";

import { ACTION_RESET, ACTION_RESTORE } from "../../common/constants";
import { CARDS, FAKE_USER_EMAIL, FAKE_USER_NAME } from "../../common/strings";
import { serviceCall, truncate } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export type HistoryContentProps = {
	isAuthenticated: boolean;
	isDev: boolean;
	user: any;
	onOpenChange: any;
	historyData: any[];
};

const onClickRestore = async (
	item: {
		user: string;
		id: number;
		model: string;
		messages: [];
		usage: number;
	},
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
	item: { user: any; id: any },
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

const renderAsTable = (
	history: any[],
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
				{history.map((item, idx) => {
					return (
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
					);
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

	return (isAuthenticated && endUser) || isDev
		? history && (
				<div className="flex flex-col gap-2 sm:flex-row">
					{renderAsTable(history, setHistory, dispatch, onOpenChange)}
				</div>
			)
		: null;
};
