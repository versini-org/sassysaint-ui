import clsx from "clsx";
import { useContext } from "react";

import { ACTION_RESET } from "../../common/constants";
import { CLEAR } from "../../common/strings";
import { AppContext } from "../../modules/App/AppContext";
import { Button } from "..";

export type ToolboxProps = {
	className?: string;
};
export const Toolbox = ({ className }: ToolboxProps) => {
	const { dispatch } = useContext(AppContext);
	const toolboxClass = clsx(className, "rounded-md flex justify-center");

	const clearChat = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch({
			type: ACTION_RESET,
		});
	};

	return (
		<div className={toolboxClass}>
			<Button slim onClick={clearChat}>
				{CLEAR}
			</Button>
		</div>
	);
};
