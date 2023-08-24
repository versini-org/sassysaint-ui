import React from "react";

export type MessagesContextProps = {
	state?: {
		role?: string;
		content?: string;
	}[];
	dispatch?: any;
};
export const MessagesContext = React.createContext<MessagesContextProps>({});
