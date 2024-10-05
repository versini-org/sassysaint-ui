import { useAuth } from "@versini/auth-provider";
import { Button } from "@versini/ui-button";
import { Card } from "@versini/ui-card";
import { useLocalStorage } from "@versini/ui-hooks";
import { Panel } from "@versini/ui-panel";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { Toggle } from "@versini/ui-toggle";
import { useContext, useEffect, useState } from "react";

import {
	LOCAL_STORAGE_PREFIX,
	LOCAL_STORAGE_TAG_PROOFREAD,
	LOCAL_STORAGE_TAG_REPHRASE,
	LOCAL_STORAGE_TAG_SUMMARIZE,
	TAGS,
	TAG_CONTENT,
} from "../../common/constants";
import { SERVICE_TYPES, serviceCall } from "../../common/services";
import { CARDS } from "../../common/strings";
import { AppContext } from "../App/AppContext";

export const TagsPanel = ({
	open,
	onOpenChange,
}: {
	onOpenChange: any;
	open: boolean;
}) => {
	const { dispatch } = useContext(AppContext);
	const { getAccessToken, user } = useAuth();
	const [userPreferences, setUserPreferences] = useState<{
		loaded: boolean;
		tags: Array<{
			enabled: boolean;
			slot: number;
			label: string;
			content: string;
		}>;
	}>({
		loaded: false,
		tags: [],
	});
	const [showSummarizeArticle, setShowSummarizeArticle] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_TAG_SUMMARIZE,
		initialValue: false,
	});
	const [showProofreadContent, setShowProofreadContent] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_TAG_PROOFREAD,
		initialValue: false,
	});
	const [showRephraseContent, setShowRephraseContent] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_TAG_REPHRASE,
		initialValue: false,
	});

	const updatePreferences = ({
		slot,
		checked,
		label,
		content,
	}: {
		slot: number;
		checked: boolean;
		label: string;
		content: string;
	}) => {
		/**
		 * if checked, we need to replace the existing tag with the new one (the tag
		 * object contains the following props: slot, label and content). If the tag slot
		 * did not exist, we need to add it to the list of tags.
		 */
		if (checked) {
			setUserPreferences((prev) => {
				const tags = prev.tags;
				const tag = {
					slot,
					label,
					content,
				};
				const index = tags.findIndex((t) => t.slot === slot);

				if (index === -1) {
					return {
						...prev,
						tags: [...tags, { ...tag, slot }],
					};
				}

				tags[index] = tag;
				return {
					...prev,
					tags: [...tags],
				};
			});
		} else {
			/**
			 * if unchecked, we need to remove the tag from the list of tags
			 */
			setUserPreferences((prev) => ({
				...prev,
				tags: prev.tags.filter((t) => t.slot !== slot),
			}));
		}
	};

	const onToggleSummarizeArticle = (checked: boolean) => {
		setShowSummarizeArticle(checked);
		updatePreferences({
			slot: 1,
			checked,
			label: TAG_CONTENT[TAGS.SUMMARIZE_ARTICLE].label,
			content: TAG_CONTENT[TAGS.SUMMARIZE_ARTICLE].content,
		});
	};
	const onToggleProofreadContent = (checked: boolean) => {
		setShowProofreadContent(checked);
		updatePreferences({
			slot: 2,
			checked,
			label: TAG_CONTENT[TAGS.PROOFREAD_CONTENT].label,
			content: TAG_CONTENT[TAGS.PROOFREAD_CONTENT].content,
		});
	};
	const onToggleRephraseContent = (checked: boolean) => {
		setShowRephraseContent(checked);
		updatePreferences({
			slot: 3,
			checked,
			label: TAG_CONTENT[TAGS.REPHRASE_CONTENT].label,
			content: TAG_CONTENT[TAGS.REPHRASE_CONTENT].content,
		});
	};

	const onSave = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		try {
			await serviceCall({
				accessToken: await getAccessToken(),
				type: SERVICE_TYPES.SET_USER_PREFERENCES,
				params: {
					user: user?.username,
					tags: userPreferences.tags,
				},
			});
			// dispatch({
			// 	type: ACTION_ENGINE,
			// 	payload: {
			// 		engine: userPreferences.engine,
			// 	},
			// });
		} catch (_error) {
			// nothing to declare officer
		}
	};

	useEffect(() => {
		console.info(`==> [${Date.now()}] : `, userPreferences);
	}, [userPreferences]);

	/**
	 * Effect to fetch the user preferences (including custom location)
	 * from the server.
	 */
	// biome-ignore lint: getAccessToken is stable
	useEffect(() => {
		if (!open || !user) {
			/**
			 * Panel is closed, no pre-fetching
			 */
			setUserPreferences({
				loaded: false,
				tags: [],
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
						tags: response.data.tags || [],
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
			title={"Tags"}
			footer={
				<Flexgrid columnGap={2} alignHorizontal="flex-end">
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
			<Card header={CARDS.TAGS.TITLE} className="prose-dark dark:prose-lighter">
				<p>{CARDS.TAGS.DESCRIPTION}</p>
				<Toggle
					noBorder
					label={TAG_CONTENT[TAGS.SUMMARIZE_ARTICLE].label}
					name={LOCAL_STORAGE_TAG_SUMMARIZE}
					onChange={onToggleSummarizeArticle}
					checked={showSummarizeArticle}
				/>
				<Toggle
					spacing={{ t: 2 }}
					noBorder
					label={TAG_CONTENT[TAGS.PROOFREAD_CONTENT].label}
					name={LOCAL_STORAGE_TAG_PROOFREAD}
					onChange={onToggleProofreadContent}
					checked={showProofreadContent}
				/>
				<Toggle
					spacing={{ t: 2 }}
					noBorder
					label={TAG_CONTENT[TAGS.REPHRASE_CONTENT].label}
					name={LOCAL_STORAGE_TAG_REPHRASE}
					onChange={onToggleRephraseContent}
					checked={showRephraseContent}
				/>
			</Card>
		</Panel>
	);
};
