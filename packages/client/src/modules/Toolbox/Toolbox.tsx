import { Button } from "@versini/ui-components";
import { useContext, useEffect, useRef } from "react";

import { ACTION_RESET, ROLE_ASSISTANT } from "../../common/constants";
import { CANCEL, CLEAR } from "../../common/strings";
import { isLastMessageFromRole } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export const Toolbox = () => {
	const { dispatch, state } = useContext(AppContext);
	const toolboxClass = "mt-2 flex justify-center rounded-md";
	const buttonRef = useRef<HTMLButtonElement>(null);
	const buttonFocusedRef = useRef(false);

	const clearChat = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch({
			type: ACTION_RESET,
		});
	};

	useEffect(() => {
		if (state?.streaming && !buttonFocusedRef.current && buttonRef.current) {
			buttonFocusedRef.current = true;
			buttonRef.current.focus();
		}

		if (!state?.streaming) {
			buttonFocusedRef.current = false;
		}
	}, [state]);

	return isLastMessageFromRole(ROLE_ASSISTANT, state) ? (
		<div className={toolboxClass}>
			<Button
				ref={buttonRef}
				noBorder
				onClick={clearChat}
				mode="dark"
				focusMode="light"
			>
				{state?.streaming ? CANCEL : CLEAR}
			</Button>
		</div>
	) : null;
};
