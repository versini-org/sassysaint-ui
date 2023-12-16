import { useAuth0 } from "@auth0/auth0-react";
import { IconDog, IconSettings, Menu, MenuItem } from "@versini/ui-components";
import { useContext, useState } from "react";

import { APP_MOTTO, APP_NAME, FAKE_USER_EMAIL } from "../../common/strings";
import { isDev, serviceCall } from "../../common/utilities";
import { About, ChatDetails, History, Profile } from "..";
import { AppContext } from "../App/AppContext";

export const MessagesContainerHeader = () => {
	const { state } = useContext(AppContext);

	const [showProfile, setShowProfile] = useState(false);
	const [showChatDetails, setShowChatDetails] = useState(false);
	const [showHistory, setShowHistory] = useState(false);
	const [showAbout, setShowAbout] = useState(false);
	const [historyData, setHistoryData] = useState<any[]>([]);
	const [fetchingHistory, setFetchingHistory] = useState({
		progress: false,
		timestamp: Date.now(),
	});

	const { isAuthenticated, user } = useAuth0();

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
	const handleFocus = async () => {
		const now = Date.now();
		if (
			!state ||
			fetchingHistory.progress ||
			now - fetchingHistory.timestamp < 5000
		) {
			return;
		}

		// prevent multiple calls
		setFetchingHistory({
			progress: true,
			timestamp: now,
		});
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
				setHistoryData(data);
				setFetchingHistory({
					progress: false,
					timestamp: Date.now(),
				});
			}
		} catch (error) {
			setFetchingHistory({
				progress: false,
				timestamp: Date.now(),
			});
			// nothing to declare officer
		}
	};

	return (
		<>
			<Profile open={showProfile} onOpenChange={setShowProfile} />
			<ChatDetails open={showChatDetails} onOpenChange={setShowChatDetails} />
			<History
				open={showHistory}
				onOpenChange={setShowHistory}
				historyData={historyData}
			/>
			<About open={showAbout} onOpenChange={setShowAbout} />

			{(isAuthenticated || isDev) && (
				<div className="relative">
					<div className="absolute bottom-[-28px] right-[-7px]">
						<Menu icon={<IconSettings />} defaultPlacement="bottom-end">
							<MenuItem label="Profile" onClick={onClickProfile} />
							<MenuItem
								label="Chat details"
								onClick={onClickChatDetails}
								disabled={!state || state.messages.length === 0}
							/>
							<MenuItem
								label="History"
								onClick={onClickHistory}
								onFocus={handleFocus}
							/>
							<MenuItem label="About" onClick={onClickAbout} />
						</Menu>
					</div>
				</div>
			)}

			<div className="flex items-center justify-center">
				<div className="basis-1/4">
					<IconDog />
				</div>
				<div>
					<h1 className="heading text-2xl font-bold text-slate-300 md:text-3xl">
						{APP_NAME}
					</h1>
					<h2 className="text-slate-300 md:text-xl">{APP_MOTTO}</h2>
				</div>
			</div>
		</>
	);
};
