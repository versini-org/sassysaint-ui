import { useAuth } from "@versini/auth-provider";
import { Button } from "@versini/ui-button";
import { Card } from "@versini/ui-card";
import { Panel } from "@versini/ui-panel";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { TextInput } from "@versini/ui-textinput";
import { Toggle } from "@versini/ui-toggle";
import { useContext, useState } from "react";

import { ACTION_SET_TAGS } from "../../common/constants";
import { SERVICE_TYPES, serviceCall } from "../../common/services";
import { TAGS_DESCRIPTION } from "../../common/strings";
import type { Tag } from "../../common/types";
import { TagsContext } from "../App/AppContext";

export const TagsPanel = ({
	open,
	onOpenChange,
}: {
	onOpenChange: any;
	open: boolean;
}) => {
	const { state: tagsState, dispatch: tagsDispatch } = useContext(TagsContext);
	const { getAccessToken, user } = useAuth();
	const [localTags, setLocalTags] = useState<{
		tags: Array<{
			enabled: boolean;
			slot: number;
			label: string;
			content: string;
		}>;
	}>({
		tags: [...tagsState.tags],
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
		setLocalTags((prev) => {
			const tags = prev.tags;
			const tag = {
				slot,
				label,
				content,
				enabled: checked,
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
	};

	const onSave = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		try {
			await serviceCall({
				accessToken: await getAccessToken(),
				type: SERVICE_TYPES.SET_USER_PREFERENCES,
				params: {
					user: user?.username,
					tags: localTags.tags,
				},
			});
			tagsDispatch({
				type: ACTION_SET_TAGS,
				payload: {
					tags: localTags.tags,
				},
			});
		} catch (_error) {
			// nothing to declare officer
		}
	};

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
			<p>{TAGS_DESCRIPTION}</p>
			{localTags.tags &&
				localTags.tags.map((tag: Tag) => (
					<Card
						key={`tag-slot-${tag.slot}`}
						header={
							tag.label !== ""
								? `Tag ${tag.slot} - ${tag.label}`
								: `Tag ${tag.slot}`
						}
						className="prose-dark dark:prose-lighter"
						spacing={{ b: 2 }}
					>
						<Flexgrid spacing={{ t: 8, b: 6 }} columnGap={2} rowGap={6}>
							<FlexgridItem span={{ fallback: 12, sm: 6 }}>
								<TextInput
									label="Label"
									name={`tag${tag.slot}-label`}
									value={tag.label}
									onChange={(e) => {
										updatePreferences({
											slot: tag.slot,
											checked: tag.enabled,
											label: e.target.value,
											content: tag.content,
										});
									}}
								/>
							</FlexgridItem>
							<FlexgridItem span={{ fallback: 12, sm: 6 }}>
								<TextInput
									label="Content"
									name={`tag${tag.slot}-content`}
									value={tag.content}
									onChange={(e) => {
										updatePreferences({
											slot: tag.slot,
											checked: tag.enabled,
											label: tag.label,
											content: e.target.value,
										});
									}}
								/>
							</FlexgridItem>
						</Flexgrid>
						<Toggle
							spacing={{ t: 2 }}
							noBorder
							label={"Enabled"}
							name={tag.slot.toString()}
							onChange={(checked) => {
								updatePreferences({
									slot: tag.slot,
									checked,
									label: tag.label,
									content: tag.content,
								});
							}}
							checked={tag.enabled}
						/>
					</Card>
				))}
		</Panel>
	);
};
