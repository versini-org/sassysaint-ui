import {
	ACTION_MESSAGE,
	ACTION_MODEL,
	ACTION_RESET,
} from "../common/constants";

export type MessageProps = {
	role?: string;
	content?: string;
};

export type StateProps = {
	id: string;
	model: string;
	usage: number;
	messages: { message: MessageProps }[];
};

export type ActionProps =
	| {
			type: typeof ACTION_MODEL;
			payload: {
				model: string;
				usage: number;
			};
	  }
	| {
			type: typeof ACTION_MESSAGE;
			payload: {
				message: MessageProps;
			};
	  }
	| { type: typeof ACTION_RESET };

export type AppContextProps = {
	state?: StateProps;
	dispatch: React.Dispatch<ActionProps>;
};
