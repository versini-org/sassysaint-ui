import { useContext, useEffect, useState } from "react";

import { ACTION_RESET, ACTION_RESTORE } from "../../common/constants";
import { CARDS, FAKE_USER_EMAIL, FAKE_USER_NAME } from "../../common/strings";
import { serviceCall, truncate } from "../../common/utilities";
import { ButtonIcon, Card, IconDelete, IconRestore } from "../../components";
import { AppContext } from "../App/AppContext";

export type HistoryContentProps = {
	isAuthenticated: boolean;
	isDev: boolean;
	user: any;
	onOpenChange: any;
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
	const borderClass = "border border-gray-700";
	const xPadding = "px-4";
	return (
		<div className="relative overflow-x-auto rounded-lg shadow-md">
			<table className="w-full text-left text-sm text-gray-400">
				<thead
					className={`bg-gray-700 text-xs uppercase text-gray-400 ${borderClass}`}
				>
					<tr>
						<th scope="col" className={`${xPadding} py-3 text-white`}>
							Date
						</th>
						<th scope="col" className={`${xPadding} py-3 text-white`}>
							First message
						</th>
						<th
							scope="col"
							className={`${xPadding} block py-3 text-right text-white`}
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{history.map((item, idx) => {
						const rowClass = idx % 2 === 0 ? "bg-gray-800" : "bg-gray-900";
						return (
							<tr
								key={`${CARDS.HISTORY.TITLE}-${item.id}-${idx}`}
								className={`${borderClass} ${rowClass}`}
							>
								<th
									scope="row"
									className={`${xPadding} py-4 font-medium sm:whitespace-nowrap`}
								>
									{item.timestamp}
								</th>
								<td className={`${xPadding} py-4 text-white`}>
									{extractFirstUserMessage(item.messages)}
								</td>

								<td className={`${xPadding} py-4`}>
									<div className="flex justify-end gap-2">
										<ButtonIcon
											label="Restore chat"
											kind="light"
											onClick={() => {
												onClickRestore(item, dispatch, onOpenChange);
											}}
										>
											<IconRestore />
										</ButtonIcon>
										<ButtonIcon
											label="Delete chat"
											kind="light"
											onClick={() => {
												onClickDelete(item, setHistory);
											}}
										>
											<div className="text-red-400">
												<IconDelete />
											</div>
										</ButtonIcon>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export const HistoryContent = ({
	isAuthenticated,
	isDev,
	user,
	onOpenChange,
}: HistoryContentProps) => {
	const [history, setHistory] = useState<any[]>([]);
	const { state, dispatch } = useContext(AppContext);
	const endUser = isDev
		? { name: FAKE_USER_NAME, email: FAKE_USER_EMAIL }
		: user;

	useEffect(() => {
		(async () => {
			if (!state) {
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
					setHistory(data);
				}
			} catch (error) {
				// nothing to declare officer
			}
		})();
	}, [state, user?.email]);

	return (isAuthenticated && endUser) || isDev ? (
		<>
			{history && (
				<div className="flex flex-col gap-2 sm:flex-row">
					<Card
						noBackground
						className="max-h-[75vh] w-full overflow-y-scroll"
						rawData={renderAsTable(history, setHistory, dispatch, onOpenChange)}
					/>
				</div>
			)}
		</>
	) : null;
};
