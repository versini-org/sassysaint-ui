import { Panel } from "@versini/ui-panel";

import { useAuth } from "@versini/auth-provider";
import { Button, ButtonIcon } from "@versini/ui-button";
import { Card } from "@versini/ui-card";
import { useLocalStorage } from "@versini/ui-hooks";
import { IconEdit } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { TextArea } from "@versini/ui-textarea";
import { Toggle } from "@versini/ui-toggle";
import { useContext, useEffect, useState } from "react";
import {
	ACTION_ENGINE,
	DEFAULT_AI_ENGINE,
	ENGINE_ANTHROPIC,
	ENGINE_OPENAI,
	LOCAL_STORAGE_CHAT_DETAILS,
	LOCAL_STORAGE_ENGINE_TOGGLE,
	LOCAL_STORAGE_PREFIX,
} from "../../common/constants";
import { SERVICE_TYPES, serviceCall } from "../../common/services";
import { APP_NAME, CARDS, SETTINGS_TITLE } from "../../common/strings";
import { getCurrentGeoLocation } from "../../common/utilities";
import { AppContext } from "../App/AppContext";
import { TagsPanel } from "./TagsPanel";

export const SettingsPanel = ({
	open,
	onOpenChange,
}: {
	onOpenChange: any;
	open: boolean;
}) => {
	const { dispatch } = useContext(AppContext);
	const { getAccessToken, user } = useAuth();
	const [showTags, setShowTags] = useState(false);
	const [userPreferences, setUserPreferences] = useState({
		loaded: false,
		instructions: "",
		loadingLocation: false,
		location: "",
		engine: DEFAULT_AI_ENGINE,
	});
	const [showEngineToggleInMenu, setShowEngineToggleInMenu] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_ENGINE_TOGGLE,
		initialValue: false,
	});
	const [showEngineDetails, setShowEngineDetails] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_CHAT_DETAILS,
		initialValue: false,
	});

	const onToggleEngineDetails = (checked: boolean) => {
		setShowEngineDetails(checked);
	};

	const onSave = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		try {
			await serviceCall({
				accessToken: await getAccessToken(),
				type: SERVICE_TYPES.SET_USER_PREFERENCES,
				params: {
					user: user?.username,
					instructions: userPreferences.instructions,
					location: userPreferences.location,
					engine: userPreferences.engine,
				},
			});
			dispatch({
				type: ACTION_ENGINE,
				payload: {
					engine: userPreferences.engine,
				},
			});
		} catch (_error) {
			// nothing to declare officer
		}
	};

	const onDetectLocation = async () => {
		setUserPreferences((prev) => ({
			...prev,
			location: "...",
			loadingLocation: true,
		}));
		try {
			const start = Date.now();
			const rawLocation = await getCurrentGeoLocation();
			const response = await serviceCall({
				accessToken: await getAccessToken(),
				type: SERVICE_TYPES.GET_LOCATION,
				params: {
					latitude: rawLocation.latitude,
					longitude: rawLocation.longitude,
				},
			});
			const end = Date.now();
			const elapsed = end - start;
			// Ensure the loading spinner is visible for at least 2 seconds
			if (elapsed < 2000) {
				await new Promise((resolve) => setTimeout(resolve, 2000 - elapsed));
			}

			if (response.status === 200) {
				const { city, state, country, displayName } = response.data;
				const location =
					city && state && country
						? `${city}, ${state}, ${country}`
						: displayName;
				setUserPreferences((prev) => ({
					...prev,
					loaded: true,
					location,
					loadingLocation: false,
				}));
			} else {
				setUserPreferences((prev) => ({
					...prev,
					loaded: true,
					location: "",
					loadingLocation: false,
				}));
			}
		} catch (_error) {
			// nothing to declare officer
		}
	};

	const onToggleEngineOpenAI = (checked: boolean) => {
		setUserPreferences((prev) => ({
			...prev,
			engine: checked ? ENGINE_OPENAI : ENGINE_ANTHROPIC,
		}));
	};

	const onToggleEngineAnthropic = (checked: boolean) => {
		setUserPreferences((prev) => ({
			...prev,
			engine: checked ? ENGINE_ANTHROPIC : ENGINE_OPENAI,
		}));
	};

	const onClickTags = () => {
		setShowTags(!showTags);
	};

	/**
	 * Effect to fetch the user preferences (including custom location)
	 * from the server.
	 */
	// biome-ignore lint/correctness/useExhaustiveDependencies: getAccessToken is stable
	useEffect(() => {
		if (!open || !user) {
			/**
			 * Panel is closed, no pre-fetching
			 */
			setUserPreferences({
				loaded: false,
				loadingLocation: false,
				instructions: "",
				location: "",
				engine: DEFAULT_AI_ENGINE,
			});
			return;
		}

		(async () => {
			try {
				const response = await serviceCall({
					accessToken: await getAccessToken(),
					type: SERVICE_TYPES.GET_USER_PREFERENCES,
					params: {
						user: user.username,
					},
				});

				if (response.status === 200) {
					setUserPreferences((prev) => ({
						...prev,
						loaded: true,
						instructions: response.data.instructions || "",
						location: response.data.location || "",
						engine: response.data.engine || DEFAULT_AI_ENGINE,
					}));
				}
			} catch (_error) {
				// nothing to declare officer
			}
		})();
	}, [user, open]);

	return (
		<Panel
			open={open}
			onOpenChange={onOpenChange}
			title={SETTINGS_TITLE}
			footer={
				<Flexgrid
					columnGap={2}
					alignHorizontal="flex-end"
					className="pb-8 sm:pb-0"
				>
					<FlexgridItem>
						<Button
							mode="dark"
							variant="secondary"
							focusMode="light"
							onClick={() => {
								onOpenChange(false);
							}}
						>
							{"Cancel"}
						</Button>
					</FlexgridItem>

					<FlexgridItem>
						<Button
							mode="dark"
							variant="danger"
							focusMode="light"
							onClick={async (e) => {
								onOpenChange(false);
								await onSave(e);
							}}
						>
							{"Save"}
						</Button>
					</FlexgridItem>
				</Flexgrid>
			}
		>
			<>
				{showTags && <TagsPanel open={showTags} onOpenChange={setShowTags} />}
				<Card
					header={CARDS.SETTINGS_ENGINE.TITLE}
					className="prose-dark dark:prose-lighter"
				>
					<p className="text-xs">
						Select the AI engine that will be used to generate responses.
					</p>
					<Toggle
						noBorder
						label={ENGINE_OPENAI}
						name={ENGINE_OPENAI}
						onChange={onToggleEngineOpenAI}
						checked={userPreferences.engine === ENGINE_OPENAI}
					/>
					<Toggle
						className="mt-2"
						noBorder
						label={ENGINE_ANTHROPIC}
						name={ENGINE_ANTHROPIC}
						onChange={onToggleEngineAnthropic}
						checked={userPreferences.engine === ENGINE_ANTHROPIC}
					/>
					<p className="text-xs">
						This option introduces a new menu at the top of the screen, enabling
						you to quickly switch between engines.
					</p>
					<Toggle
						className="mt-2"
						noBorder
						label={"Show Quick Engine Toggle Menu"}
						name={"show-toggle-engine-menu"}
						onChange={setShowEngineToggleInMenu}
						checked={showEngineToggleInMenu}
					/>
					<p className="text-xs">
						This option adds individual statistics for each messages under their
						respective bubbles, such as processing time, model name, and more.
					</p>
					<Toggle
						className="mt-2"
						noBorder
						label={"Show Message Statistics"}
						name={"show-message-statistics"}
						onChange={onToggleEngineDetails}
						checked={showEngineDetails}
					/>

					<h3 className="border-b-2 border-slate-400">Tags</h3>
					<ButtonIcon
						className="mt-2"
						size="small"
						onClick={onClickTags}
						labelLeft="Edit Custom Tags"
					>
						<IconEdit size="size-3" monotone />
					</ButtonIcon>
				</Card>

				<Card
					header={"Custom Instructions"}
					className="prose-dark dark:prose-lighter mt-4"
				>
					<p>
						What would you like <em>{APP_NAME}</em> to know about you to provide
						better responses?
					</p>
					<TextArea
						mode="alt-system"
						autoCapitalize="off"
						autoComplete="off"
						autoCorrect="off"
						name="customInstructions"
						label="Custom Instructions"
						value={userPreferences.instructions}
						onChange={(e: any) => {
							setUserPreferences((prev) => ({
								...prev,
								loaded: true,
								instructions: e.target.value,
							}));
						}}
						helperText="Press ENTER to add a new line."
					/>
				</Card>

				<Card
					header={"Location"}
					className="prose-dark dark:prose-lighter mt-4"
				>
					<p>
						You can share your location to receive customized responses based on
						your area.
					</p>
					<TextArea
						mode="alt-system"
						name="location"
						label={"Location"}
						value={userPreferences.location}
						onChange={(e: any) => {
							setUserPreferences((prev) => ({
								...prev,
								loaded: true,
								location: e.target.value,
							}));
						}}
						helperText="Enter your location or press auto-detect."
					/>
					<Button
						className="mt-2"
						size="small"
						noBorder
						disabled={userPreferences.loadingLocation}
						onClick={onDetectLocation}
					>
						{userPreferences.loadingLocation ? "Detecting..." : "Auto-detect"}
					</Button>
				</Card>
			</>
		</Panel>
	);
};
