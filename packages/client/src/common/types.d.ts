import {
	ACTION_LOCATION,
	ACTION_MESSAGE,
	ACTION_MODEL,
	ACTION_RESET,
	ACTION_RESTORE,
} from "./constants";

export type GeoLocation = {
	latitude: number;
	longitude: number;
	accuracy: number;
	city?: string;
	region?: string;
	country?: string;
};

export type MessageProps = {
	role?: string;
	content?: string;
	name?: string;
};

export type StateProps = {
	id: string;
	model: string;
	usage: number;
	location?: GeoLocation;
	messages: { message: MessageProps }[];
};

export type ActionProps =
	| undefined
	| {
			type: typeof ACTION_RESTORE;
			payload: {
				model: string;
				id: string;
				usage: number;
				messages: MessageProps[];
			};
	  }
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
	| { type: typeof ACTION_RESET }
	| {
			type: typeof ACTION_LOCATION;
			payload: {
				location: GeoLocation;
			};
	  };

export type AppContextProps = {
	state?: StateProps;
	dispatch: React.Dispatch<ActionProps>;
};

export type MessagesContainerProps = {
	noHeader?: boolean;
};

export type MessageUserProps = {
	children: string;
};

export type MessageAssistantProps = {
	children: string;
	name?: string;
	smoothScrollRef: React.RefObject<HTMLDivElement>;
};
