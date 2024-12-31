import { useAuth } from "@versini/auth-provider";
import { Button } from "@versini/ui-button";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { useContext, useEffect, useState } from "react";

import { ACTION_SET_TAGS, ACTION_TOGGLE_TAG } from "../../common/constants";
import { SERVICE_TYPES, serviceCall } from "../../common/services";
import type { Tag } from "../../common/types";
import { TagsContext } from "../App/AppContext";

export const Toolbox = () => {
	const { dispatch: tagsDispatch, state: tagsState } = useContext(TagsContext);
	const { getAccessToken, user } = useAuth();

	const [userPreferences, setUserPreferences] = useState<{
		loaded: boolean;
	}>({
		loaded: false,
	});

	const toolboxClass = "mt-2 flex justify-center rounded-md";

	const onClickToggleTag = (
		e: { preventDefault: () => void },
		tagType: string,
	) => {
		e.preventDefault();
		tagsDispatch({
			type: ACTION_TOGGLE_TAG,
			payload: {
				tag: tagType,
			},
		});
	};

	/**
	 * Effect to fetch the user tags from the server.
	 */
	// biome-ignore lint: getAccessToken is stable
	useEffect(() => {
		if (!user) {
			/**
			 * User is not known, no pre-fetching
			 */
			setUserPreferences({
				loaded: false,
			});
			return;
		}
		if (userPreferences.loaded) {
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
					tagsDispatch({
						type: ACTION_SET_TAGS,
						payload: {
							tags: response.data.tags || [],
						},
					});
					setUserPreferences({
						loaded: true,
					});
				}
			} catch (_error) {
				// nothing to declare officer
			}
		})();
	}, [user]);

	return (
		<>
			<Flexgrid alignHorizontal="center" columnGap={2}>
				{userPreferences &&
					userPreferences.loaded &&
					tagsState.tags &&
					tagsState.tags.map((tag: Tag) => {
						return (
							tag.enabled &&
							tag.label &&
							tag.content && (
								<FlexgridItem key={`tag-button-${tag.slot}`}>
									<div className={toolboxClass}>
										<Button
											noBorder
											mode="dark"
											focusMode="light"
											size="small"
											onClick={(e) => onClickToggleTag(e, tag.content)}
										>
											{tag.label}
										</Button>
									</div>
								</FlexgridItem>
							)
						);
					})}
			</Flexgrid>
		</>
	);
};
