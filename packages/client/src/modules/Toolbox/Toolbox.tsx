import { Button } from "@versini/ui-components";
import { useContext } from "react";

import { ACTION_RESET, ROLE_ASSISTANT } from "../../common/constants";
import { CLEAR } from "../../common/strings";
import { isLastMessageFromRole } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export const Toolbox = () => {
	const { dispatch, state } = useContext(AppContext);
	const toolboxClass = "mt-2 flex justify-center rounded-md";

	const clearChat = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch({
			type: ACTION_RESET,
		});
	};

	return isLastMessageFromRole(ROLE_ASSISTANT, state) ? (
		<div className={toolboxClass}>
			<Button noBorder onClick={clearChat} mode="dark" focusMode="light">
				{CLEAR}
			</Button>
		</div>
	) : null;
};
