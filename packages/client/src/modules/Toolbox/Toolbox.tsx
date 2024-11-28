import { useAuth } from "@versini/auth-provider";
import { Button } from "@versini/ui-button";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { useContext, useEffect, useRef, useState } from "react";

import {
	ACTION_RESET,
	ACTION_SET_TAGS,
	ACTION_TOGGLE_TAG,
	ROLE_ASSISTANT,
} from "../../common/constants";
import { SERVICE_TYPES, serviceCall } from "../../common/services";
import { CANCEL, CLEAR } from "../../common/strings";
import { isLastMessageFromRole } from "../../common/utilities";
import { AppContext, TagsContext } from "../App/AppContext";

import type { Tag } from "../../common/types";

export const Toolbox = () => {
	const { dispatch, state } = useContext(AppContext);
	const { dispatch: tagsDispatch, state: tagsState } = useContext(TagsContext);
	const { getAccessToken, user } = useAuth();

	const [userPreferences, setUserPreferences] = useState<{
		loaded: boolean;
	}>({
		loaded: false,
	});

	const toolboxClass = "mt-2 flex justify-center rounded-md";
	const buttonRef = useRef<HTMLButtonElement>(null);
	const buttonFocusedRef = useRef(false);

	const clearChat = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch({
			type: ACTION_RESET,
		});
	};

	/**
	 * Focus the clear button when the chat is streaming,
	 * but only if it was not manually focused before.
	 */
	useEffect(() => {
		if (
			state?.streaming === true &&
			!buttonFocusedRef.current &&
			buttonRef.current
		) {
			buttonFocusedRef.current = true;
			buttonRef.current.focus();
		}

		if (state?.streaming === false) {
			buttonFocusedRef.current = false;
		}
	}, [state]);

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

			{isLastMessageFromRole(ROLE_ASSISTANT, state) && (
				<div className={toolboxClass}>
					<Button
						noBorder
						mode="dark"
						focusMode="light"
						ref={buttonRef}
						onClick={clearChat}
					>
						{state?.streaming ? CANCEL : CLEAR}
					</Button>
				</div>
			)}
		</>
	);
};
