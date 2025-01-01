import { useAuth } from "@versini/auth-provider";
import { ButtonIcon } from "@versini/ui-button";
import { useLocalStorage } from "@versini/ui-hooks";
import {
	IconAnthropic,
	IconBack,
	IconChart,
	IconHistory,
	IconInfo,
	IconOpenAI,
	IconProfile,
	IconSettings,
} from "@versini/ui-icons";
import { Menu, MenuItem, MenuSeparator } from "@versini/ui-menu";
import { ToggleGroup, ToggleGroupItem } from "@versini/ui-togglegroup";
import { useContext, useEffect, useState } from "react";

import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import {
	ACTION_ENGINE,
	ACTION_RESET,
	DEFAULT_AI_ENGINE,
	ENGINE_ANTHROPIC,
	LOCAL_STORAGE_ENGINE_TOGGLE,
	LOCAL_STORAGE_PREFIX,
} from "../../common/constants";
import { SERVICE_TYPES, serviceCall } from "../../common/services";
import { LOG_OUT, STATS } from "../../common/strings";
import { About } from "../About/About";
import { AppContext } from "../App/AppContext";
import { ChatDetails } from "../ChatDetails/ChatDetails";
import { ConfirmationPanel } from "../Common/ConfirmationPanel";
import { NewChatButton } from "../Common/NewChatButton";
import { HistoryPanel } from "../History/HistoryPanel";
import { Profile } from "../Profile/Profile";

const LazyHeader = () => {
	const { state, dispatch, serverStats } = useContext(AppContext);

	const [engine, setEngine] = useState(state?.engine || DEFAULT_AI_ENGINE);
	const [showProfile, setShowProfile] = useState(false);
	const [showChatDetails, setShowChatDetails] = useState(false);
	const [showHistory, setShowHistory] = useState(false);
	const [showAbout, setShowAbout] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);

	const [showEngineToggleInMenu] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_ENGINE_TOGGLE,
		initialValue: false,
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
	const onClickConfirmLogout = () => {
		setShowConfirmation(!showConfirmation);
	};

	useEffect(() => {
		if (state && state.engine && state.engine !== engine) {
			setEngine(state.engine);
		}
	}, [state, engine]);

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
			<HistoryPanel open={showHistory} onOpenChange={setShowHistory} />
			<About open={showAbout} onOpenChange={setShowAbout} />

			<div className="sticky top-0 bg-slate-900 py-4">
				<Flexgrid alignHorizontal="space-between" alignVertical="center">
					<FlexgridItem>
						<NewChatButton mode="dark" radius="large" />
					</FlexgridItem>

					<FlexgridItem>
						<Flexgrid>
							{showEngineToggleInMenu && serverStats && (
								<FlexgridItem>
									<Menu
										mode="dark"
										focusMode="light"
										trigger={
											<ButtonIcon className="mr-2">
												{state && state.engine === ENGINE_ANTHROPIC ? (
													<IconAnthropic />
												) : (
													<IconOpenAI />
												)}
											</ButtonIcon>
										}
										defaultPlacement="bottom-start"
									>
										<MenuItem raw ignoreClick>
											<ToggleGroup
												size="small"
												mode="dark"
												focusMode="light"
												value={engine}
												onValueChange={async (value: string) => {
													if (value) {
														try {
															await serviceCall({
																accessToken: await getAccessToken(),
																type: SERVICE_TYPES.SET_USER_PREFERENCES,
																params: {
																	user: user?.username,
																	engine: value,
																},
															});
															dispatch({
																type: ACTION_ENGINE,
																payload: {
																	engine: value,
																},
															});
															dispatch({
																type: ACTION_RESET,
															});
														} catch (_error) {
															// nothing to declare officer
														}
													}
												}}
											>
												{serverStats &&
													serverStats.engines.map((engine) => (
														<ToggleGroupItem key={engine} value={engine} />
													))}
											</ToggleGroup>
										</MenuItem>
									</Menu>
								</FlexgridItem>
							)}
							<FlexgridItem>
								<Menu
									mode="dark"
									focusMode="light"
									trigger={
										<ButtonIcon>
											<IconSettings />
										</ButtonIcon>
									}
									defaultPlacement="bottom-end"
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
							</FlexgridItem>
						</Flexgrid>
					</FlexgridItem>
				</Flexgrid>
			</div>
		</>
	);
};

export default LazyHeader;
