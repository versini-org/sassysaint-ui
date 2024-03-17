import { useAuth0 } from "@auth0/auth0-react";
import {
	Button,
	Menu,
	MenuItem,
	MenuSeparator,
	Panel,
} from "@versini/ui-components";
import {
	IconBack,
	IconChart,
	IconDog,
	IconHistory,
	IconInfo,
	IconProfile,
	IconSettings,
} from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { useContext, useState } from "react";

import { GRAPHQL_QUERIES, graphQLCall } from "../../common/services";
import {
	APP_MOTTO,
	APP_NAME,
	FAKE_USER_EMAIL,
	LOG_OUT,
	STATS,
} from "../../common/strings";
import { isDev } from "../../common/utilities";
import { About } from "../About/About";
import { AppContext } from "../App/AppContext";
import { ChatDetails } from "../ChatDetails/ChatDetails";
import { History } from "../History/History";
import { Profile } from "../Profile/Profile";

export const MessagesContainerHeader = () => {
	const { state } = useContext(AppContext);

	const [showProfile, setShowProfile] = useState(false);
	const [showChatDetails, setShowChatDetails] = useState(false);
	const [showHistory, setShowHistory] = useState(false);
	const [showAbout, setShowAbout] = useState(false);
	const [historyData, setHistoryData] = useState<any[]>([]);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [fetchingHistory, setFetchingHistory] = useState({
		done: false,
		progress: false,
		timestamp: Date.now(),
	});

	const { isAuthenticated, user, logout } = useAuth0();
	const logoutWithRedirect = () =>
		logout({
			logoutParams: {
				returnTo: window.location.origin,
			},
		});

	const onClickProfile = () => {
		setShowProfile(!showProfile);
	};
	const onClickChatDetails = () => {
		setShowChatDetails(!showChatDetails);
	};
	const onClickHistory = () => {
		setShowHistory(!showHistory);
	};
	const onClickAbout = () => {
		setShowAbout(!showAbout);
	};
	const onOpenChange = async (open: boolean) => {
		const now = Date.now();

		if (!open) {
			/**
			 * Menu is closed, no pre-fetching
			 */
			return;
		}

		if (
			!state ||
			fetchingHistory.progress ||
			(fetchingHistory.done === true && now - fetchingHistory.timestamp < 5000)
		) {
			/**
			 * Menu is opened, but
			 * - prefetching is in progress, or
			 * - prefetching was done at least once, but it was less than 5 seconds ago
			 *
			 * Therefore, no prefetching.
			 */
			return;
		}

		setFetchingHistory({
			done: true,
			progress: true,
			timestamp: now,
		});

		try {
			const response = await graphQLCall({
				query: GRAPHQL_QUERIES.GET_CHATS,
				data: {
					userId: user?.email || FAKE_USER_EMAIL,
				},
			});

			if (response.status === 200) {
				const data = await response.json();
				setHistoryData(data.data.chats);
				setFetchingHistory({
					done: true,
					progress: false,
					timestamp: Date.now(),
				});
			}
		} catch (error) {
			setFetchingHistory({
				done: true,
				progress: false,
				timestamp: Date.now(),
			});
			// nothing to declare officer
		}
	};

	const onClickConfirmLogout = () => {
		setShowConfirmation(!showConfirmation);
	};

	return (
		<>
			{(isAuthenticated || isDev) && (
				<>
					<Panel
						kind="messagebox"
						open={showConfirmation}
						onOpenChange={setShowConfirmation}
						title={LOG_OUT}
						footer={
							<Flexgrid columnGap={2} alignHorizontal="flex-end">
								<FlexgridItem>
									<Button
										mode="dark"
										variant="secondary"
										focusMode="light"
										onClick={() => {
											setShowConfirmation(false);
										}}
									>
										Cancel
									</Button>
								</FlexgridItem>
								<FlexgridItem>
									<Button
										mode="dark"
										variant="danger"
										focusMode="light"
										onClick={() => logoutWithRedirect()}
									>
										{LOG_OUT}
									</Button>
								</FlexgridItem>
							</Flexgrid>
						}
					>
						<p>Are you sure you want to log out?</p>
					</Panel>
					<Profile open={showProfile} onOpenChange={setShowProfile} />
					<ChatDetails
						open={showChatDetails}
						onOpenChange={setShowChatDetails}
					/>
					<History
						open={showHistory}
						onOpenChange={setShowHistory}
						historyData={historyData}
					/>
					<About open={showAbout} onOpenChange={setShowAbout} />
					<div className="relative">
						<div className="absolute bottom-[-28px] right-[-7px]">
							<Menu
								mode="dark"
								focusMode="light"
								icon={<IconSettings />}
								defaultPlacement="bottom-end"
								onOpenChange={onOpenChange}
							>
								<MenuItem
									label="Profile"
									onClick={onClickProfile}
									icon={<IconProfile />}
								/>
								<MenuItem
									label={STATS}
									onClick={onClickChatDetails}
									icon={<IconChart />}
								/>
								<MenuItem
									label="History"
									onClick={onClickHistory}
									icon={<IconHistory />}
								/>
								<MenuItem
									label="About"
									onClick={onClickAbout}
									icon={<IconInfo />}
								/>
								<MenuSeparator />
								<MenuItem
									label="Log out"
									onClick={onClickConfirmLogout}
									icon={
										<div className="text-red-700">
											<IconBack monotone />
										</div>
									}
								/>
							</Menu>
						</div>
					</div>
				</>
			)}

			<div className="flex items-center justify-center">
				<div className="basis-1/4">
					<IconDog />
				</div>
				<div className="prose prose-sm prose-light md:prose-base prose-h1:mb-0 prose-h2:mt-0">
					<h1>{APP_NAME}</h1>
					<h2>{APP_MOTTO}</h2>
				</div>
			</div>
		</>
	);
};
