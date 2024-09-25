import { Button } from "@versini/ui-button";
import { useLocalStorage } from "@versini/ui-hooks";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { useContext, useEffect, useRef } from "react";

import {
	ACTION_RESET,
	ACTION_TOGGLE_TAG,
	LOCAL_STORAGE_PREFIX,
	ROLE_ASSISTANT,
	TAGS,
	TAG_CONTENT,
} from "../../common/constants";
import { CANCEL, CLEAR } from "../../common/strings";
import { isLastMessageFromRole } from "../../common/utilities";
import { AppContext, TagsContext } from "../App/AppContext";

export const Toolbox = () => {
	const { dispatch, state } = useContext(AppContext);
	const { dispatch: tagsDispatch } = useContext(TagsContext);

	const toolboxClass = "mt-2 flex justify-center rounded-md";
	const buttonRef = useRef<HTMLButtonElement>(null);
	const buttonFocusedRef = useRef(false);

	const [showSummarizeArticle] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + "summarize-article",
		initialValue: false,
	});
	const [showProofreadContent] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + "proofread-content",
		initialValue: false,
	});
	const [showRephraseContent] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + "rephrase-content",
		initialValue: false,
	});

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

	return (
		<>
			<Flexgrid alignHorizontal="center" columnGap={2}>
				<FlexgridItem>
					{showSummarizeArticle && (
						<div className={toolboxClass}>
							<Button
								noBorder
								mode="dark"
								focusMode="light"
								size="small"
								onClick={(e) => onClickToggleTag(e, TAGS.SUMMARIZE_ARTICLE)}
							>
								{TAG_CONTENT[TAGS.SUMMARIZE_ARTICLE].label}
							</Button>
						</div>
					)}
				</FlexgridItem>
				<FlexgridItem>
					{showProofreadContent && (
						<div className={toolboxClass}>
							<Button
								noBorder
								mode="dark"
								focusMode="light"
								size="small"
								onClick={(e) => onClickToggleTag(e, TAGS.PROOFREAD_CONTENT)}
							>
								{TAG_CONTENT[TAGS.PROOFREAD_CONTENT].label}
							</Button>
						</div>
					)}
				</FlexgridItem>
				<FlexgridItem>
					{showRephraseContent && (
						<div className={toolboxClass}>
							<Button
								noBorder
								mode="dark"
								focusMode="light"
								size="small"
								onClick={(e) => onClickToggleTag(e, TAGS.REPHRASE_CONTENT)}
							>
								{TAG_CONTENT[TAGS.REPHRASE_CONTENT].label}
							</Button>
						</div>
					)}
				</FlexgridItem>
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
