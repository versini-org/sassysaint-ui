import {
	ACTION_LOCATION,
	ACTION_MESSAGE,
	ACTION_MODEL,
	ACTION_RESET,
	ACTION_RESTORE,
	ACTION_STREAMING,
} from "./constants";

export type GeoLocation = {
	accuracy: number;
	latitude: number;
	longitude: number;

	country?: string;
	state?: string;
	city?: string;

	displayName?: string;
};

export type MessageProps = {
	content?: string;
	name?: string;
	processingTime?: number;
	role?: string;
	messageId?: string;
};

export type StateProps = {
	id: string;
	messages: { message: MessageProps }[];
	model: string;
	usage: number;
	isComponent: boolean;

	streaming?: boolean;
};

export type ActionProps =
	| undefined
	| {
			payload: {
				id: string;
				messages: MessageProps[];
				model: string;
				usage: number;
			};
			type: typeof ACTION_RESTORE;
	  }
	| {
			payload: {
				model: string;
				usage: number;
			};
			type: typeof ACTION_MODEL;
	  }
	| {
			payload: {
				message: MessageProps;
			};
			type: typeof ACTION_MESSAGE;
	  }
	| { type: typeof ACTION_RESET }
	| {
			payload: {
				streaming: boolean;
			};
			type: typeof ACTION_STREAMING;
	  };

export type ServerStatsProps = {
	version: string;
	models: string[];
	plugins: string[];
};

export type AppContextProps = {
	dispatch: React.Dispatch<ActionProps>;

	state?: StateProps;
	serverStats?: ServerStatsProps;
};

export type MessageAssistantProps = {
	children?: string;
	loading?: boolean;
	name?: string;
	processingTime?: number;
};
