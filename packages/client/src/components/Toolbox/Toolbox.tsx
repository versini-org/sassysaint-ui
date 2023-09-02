import { useContext } from "react";

import { ROLE_RESET } from "../../common/constants";
import { Button } from "..";
import { MessagesContext } from "../Messages/MessagesContext";

export const Toolbox = () => {
	const { dispatch } = useContext(MessagesContext);

	const clearChat = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch({ role: ROLE_RESET });
	};

	return (
		<div className="mt-2 rounded-md flex justify-center">
			<Button slim onClick={clearChat}>
				Clear chat
			</Button>
		</div>
	);
};
