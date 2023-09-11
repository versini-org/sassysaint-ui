import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

import { APP_MOTTO, APP_NAME } from "../../common/strings";
import { isDev } from "../../common/utilities";
import { ChatDetails, IconDog, IconSettings } from "..";
import { Menu, MenuItem, Profile } from "..";

export const MessagesContainerHeader = () => {
	const [showProfile, setShowProfile] = useState(false);
	const [showChatDetails, setShowChatDetails] = useState(false);
	const { isAuthenticated } = useAuth0();

	const onClickProfile = () => {
		setShowProfile(!showProfile);
	};
	const onClickChatDetails = () => {
		setShowChatDetails(!showChatDetails);
	};

	return (
		<>
			<Profile open={showProfile} onOpenChange={setShowProfile} />
			<ChatDetails open={showChatDetails} onOpenChange={setShowChatDetails} />

			{(isAuthenticated || isDev) && (
				<div className="relative">
					<div className="absolute bottom-[-28px] right-[-7px]">
						<Menu icon={<IconSettings />}>
							<MenuItem label="Profile" onClick={onClickProfile} />
							<MenuItem label="Chat details" onClick={onClickChatDetails} />
						</Menu>
					</div>
				</div>
			)}

			<div className="flex items-center justify-center">
				<div className="basis-1/4">
					<IconDog />
				</div>
				<div>
					<h1 className="heading text-2xl md:text-3xl font-bold text-slate-300">
						{APP_NAME}
					</h1>
					<h2 className="text-slate-300 md:text-xl">{APP_MOTTO}</h2>
				</div>
			</div>
		</>
	);
};
