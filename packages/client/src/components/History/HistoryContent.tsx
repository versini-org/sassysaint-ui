import { useContext, useEffect, useState } from "react";

import { CARDS, FAKE_USER_EMAIL, FAKE_USER_NAME } from "../../common/strings";
import { truncate } from "../../common/utilities";
import { AppContext } from "../../modules/AppContext";
import { Button, Card, IconRestore } from "..";
import { IconDelete } from "../Icons/IconDelete";

export type HistoryContentProps = {
	isAuthenticated: boolean;
	isDev: boolean;
	user: any;
};

const renderAsTable = (history: any[]) => {
	return (
		<div className="relative overflow-x-auto shadow-md rounded-lg">
			<table className="w-full text-sm text-left text-gray-400">
				<thead className="text-xs uppercase bg-gray-700 text-gray-400">
					<tr>
						<th scope="col" className="px-6 py-3">
							Timestamp
						</th>
						<th scope="col" className="px-6 py-3">
							First message
						</th>
						<th scope="col" className="px-6 py-3">
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
								className={`border ${rowClass} border-gray-700`}
							>
								<th
									scope="row"
									className="px-6 py-4 font-medium sm:whitespace-nowrap"
								>
									{item.timestamp}
								</th>
								<td className="px-6 py-4 text-white">
									{truncate(item.messages[1].content, 200)}
								</td>

								<td className="px-6 py-4">
									<div className="flex gap-2 justify-center">
										<Button iconOnly kind="light">
											<IconRestore />
										</Button>
										<Button iconOnly kind="light">
											<IconDelete />
										</Button>
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
}: HistoryContentProps) => {
	const [history, setHistory] = useState<any[]>([]);
	const { state } = useContext(AppContext);
	const endUser = isDev
		? { name: FAKE_USER_NAME, email: FAKE_USER_EMAIL }
		: user;

	useEffect(() => {
		(async () => {
			if (!state) {
				return;
			}
			try {
				const response = await fetch(
					`${import.meta.env.VITE_SERVER_URL}/api/chats`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							messages: state.messages,
							model: state.model,
							user: user?.email || FAKE_USER_EMAIL,
							id: state.id,
						}),
					},
				);

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
				<div className="flex flex-col sm:flex-row gap-2">
					<Card
						className="w-full overflow-y-scroll max-h-[75vh]"
						rawData={renderAsTable(history)}
					/>
				</div>
			)}
		</>
	) : null;
};
