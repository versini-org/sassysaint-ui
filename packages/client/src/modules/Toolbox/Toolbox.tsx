import { Button } from "@versini/ui-components";
import { useContext, useEffect, useRef } from "react";

import { useLocalStorage } from "@versini/ui-hooks";
import {
	ACTION_RESET,
	LOCAL_STORAGE_PREFIX,
	ROLE_ASSISTANT,
} from "../../common/constants";
import { CANCEL, CLEAR } from "../../common/strings";
import { isLastMessageFromRole } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export const Toolbox = () => {
	const { dispatch, state } = useContext(AppContext);
	const toolboxClass = "mt-2 flex justify-center rounded-md";
	const buttonRef = useRef<HTMLButtonElement>(null);
	const buttonFocusedRef = useRef(false);

	const [showSummarizeArticle] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + "summarize-article",
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

	return (
		<>
			{showSummarizeArticle && (
				<div className={toolboxClass}>
					<Button noBorder mode="dark" focusMode="light" size="small">
						Summarize
					</Button>
				</div>
			)}

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
