import { useAuth } from "@versini/auth-provider";
import {
	ButtonIcon,
	Menu,
	MenuItem,
	MenuSeparator,
} from "@versini/ui-components";
import {
	IconBack,
	IconChart,
	IconHistory,
	IconInfo,
	IconProfile,
	IconSettings,
} from "@versini/ui-icons";
import { useContext, useState } from "react";
import { SERVICE_TYPES, serviceCall } from "../../common/services";
import { LOG_OUT, STATS } from "../../common/strings";
import { AppContext } from "../App/AppContext";

import { About } from "../About/About";

import { ChatDetails } from "../ChatDetails/ChatDetails";
import { ConfirmationPanel } from "../Common/ConfirmationPanel";
import { History } from "../History/History";
import { Profile } from "../Profile/Profile";

const LazyHeader = () => {
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

	const { logout, getAccessToken, user } = useAuth();

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
			!user ||
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
			const response = await serviceCall({
				accessToken: await getAccessToken(),
				type: SERVICE_TYPES.GET_CHATS,
				params: {
					userId: user.username,
				},
			});
			if (response.status === 200) {
				setHistoryData(response.data);
				setFetchingHistory({
					done: true,
					progress: false,
					timestamp: Date.now(),
				});
			}
		} catch (_error) {
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
			<ConfirmationPanel
				showConfirmation={showConfirmation}
				setShowConfirmation={setShowConfirmation}
				action={logout}
				customStrings={{
					confirmAction: LOG_OUT,
					cancelAction: "Cancel",
					title: LOG_OUT,
				}}
			>
				<p>Are you sure you want to log out?</p>
			</ConfirmationPanel>

			<Profile open={showProfile} onOpenChange={setShowProfile} />
			<ChatDetails open={showChatDetails} onOpenChange={setShowChatDetails} />
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
						trigger={
							<ButtonIcon>
								<IconSettings />
							</ButtonIcon>
						}
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
						{state && state.id && !state.isComponent && (
							<>
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
							</>
						)}
					</Menu>
				</div>
			</div>
		</>
	);
};

export default LazyHeader;
