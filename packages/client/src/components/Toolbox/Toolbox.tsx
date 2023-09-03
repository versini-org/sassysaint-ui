import clsx from "clsx";
import { useContext } from "react";

import { ROLE_RESET } from "../../common/constants";
import { Button } from "..";
import { MessagesContext } from "../Messages/MessagesContext";

export type ToolboxProps = {
	className?: string;
};
export const Toolbox = ({ className }: ToolboxProps) => {
	const { dispatch } = useContext(MessagesContext);
	const toolboxClass = clsx(className, "rounded-md flex justify-center");

	const clearChat = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch({ role: ROLE_RESET });
	};

	return (
		<div className={toolboxClass}>
			<Button slim onClick={clearChat}>
				Clear chat
			</Button>
		</div>
	);
};
