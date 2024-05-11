import {
	ACTION_LOCATION,
	ACTION_MESSAGE,
	ACTION_MODEL,
	ACTION_RESET,
	ACTION_RESTORE,
} from "./constants";

export type GeoLocation = {
	accuracy: number;
	latitude: number;
	longitude: number;

	city?: string;
	country?: string;
	countryShort?: string;
	region?: string;
	regionShort?: string;
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

	location?: GeoLocation;
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
				location: GeoLocation;
			};
			type: typeof ACTION_LOCATION;
	  };

export type AppContextProps = {
	dispatch: React.Dispatch<ActionProps>;

	state?: StateProps;
};

export type MessageAssistantProps = {
	children?: string;
	loading?: boolean;
	name?: string;
	processingTime?: number;
};
