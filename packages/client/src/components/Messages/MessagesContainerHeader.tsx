import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

import { isDev } from "../../common/utilities";
import { Button, IconDog, IconSettings } from "..";
import { Settings } from "..";

export const MessagesContainerHeader = () => {
	const [showSettings, setShowSettings] = useState(false);
	const { isAuthenticated } = useAuth0();

	const onClickSettings = () => {
		setShowSettings(!showSettings);
	};
	return (
		<>
			<Settings open={showSettings} onOpenChange={setShowSettings} />

			{(isAuthenticated || isDev) && (
				<div className="relative">
					<Button
						iconOnly
						onClick={onClickSettings}
						className="absolute bottom-[-28px] right-[-7px]"
					>
						<div>
							<IconSettings />
						</div>
					</Button>
				</div>
			)}

			<div className="flex items-center justify-center">
				<div className="basis-1/4">
					<IconDog />
				</div>
				<div>
					<h1 className="heading text-2xl md:text-3xl font-bold text-slate-300">
						Sassy Saint
					</h1>
					<h2 className="text-slate-300 md:text-xl">ASK! ME! ANYTHING!</h2>
				</div>
			</div>
		</>
	);
};
