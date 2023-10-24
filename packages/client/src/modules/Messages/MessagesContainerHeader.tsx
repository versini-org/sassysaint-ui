import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useState } from "react";

import { APP_MOTTO, APP_NAME } from "../../common/strings";
import { isDev } from "../../common/utilities";
import { IconDog, IconSettings, Menu, MenuItem } from "../../components";
import { About, ChatDetails, History, Profile } from "..";
import { AppContext } from "../App/AppContext";

export const MessagesContainerHeader = () => {
	const { state } = useContext(AppContext);
	const [showProfile, setShowProfile] = useState(false);
	const [showChatDetails, setShowChatDetails] = useState(false);
	const [showHistory, setShowHistory] = useState(false);
	const [showAbout, setShowAbout] = useState(false);
	const { isAuthenticated } = useAuth0();

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

	return (
		<>
			<Profile open={showProfile} onOpenChange={setShowProfile} />
			<ChatDetails open={showChatDetails} onOpenChange={setShowChatDetails} />
			<History open={showHistory} onOpenChange={setShowHistory} />
			<About open={showAbout} onOpenChange={setShowAbout} />

			{(isAuthenticated || isDev) && (
				<div className="relative">
					<div className="absolute bottom-[-28px] right-[-7px]">
						<Menu icon={<IconSettings />}>
							<MenuItem label="Profile" onClick={onClickProfile} />
							<MenuItem
								label="Chat details"
								onClick={onClickChatDetails}
								disabled={!state || state.messages.length === 0}
							/>
							<MenuItem label="History" onClick={onClickHistory} />
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
