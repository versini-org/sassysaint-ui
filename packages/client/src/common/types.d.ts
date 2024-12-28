import { TableCellSortDirections } from "@versini/ui-table";
import {
	ACTION_ENGINE,
	ACTION_LOCATION,
	ACTION_MESSAGE,
	ACTION_MODEL,
	ACTION_RESET,
	ACTION_RESET_TAGS,
	ACTION_RESTORE,
	ACTION_SEARCH,
	ACTION_SET_TAGS,
	ACTION_SORT,
	ACTION_STREAMING,
	ACTION_TOGGLE_TAG,
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
	engine: string;
	tags: string[];

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
	  }
	| {
			payload: {
				engine: string;
			};
			type: typeof ACTION_ENGINE;
	  };

export type ServerStatsProps = {
	version: string;
	models: string[];
	plugins: string[];
	engine: string;
	engines: string[];
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

export type Tag = {
	enabled: boolean;
	slot: number;
	label: string;
	content: string;
};

export type StateTagsProps = {
	tag: string;
	tags: Tag[];
};

export type ActionTagsProps =
	| undefined
	| {
			payload: {
				tag: string;
			};
			type: typeof ACTION_TOGGLE_TAG;
	  }
	| {
			type: typeof ACTION_RESET_TAGS;
	  }
	| {
			payload: {
				tags: Tag[];
			};
			type: typeof ACTION_SET_TAGS;
	  };

export type StateHistoryProps = {
	searchString: string;
	sortedCell: string;
	sortDirection:
		| typeof TableCellSortDirections.ASC
		| typeof TableCellSortDirections.DESC;
};

export type ActionHistoryProps =
	| undefined
	| {
			payload: {
				searchString: string;
			};
			type: typeof ACTION_SEARCH;
	  }
	| {
			payload: {
				sortedCell: string;
				sortDirection: string;
			};
			type: typeof ACTION_SORT;
	  };

export type HistoryContextProps = {
	dispatch: React.Dispatch<ActionHistoryProps>;
	state: StateHistoryProps;
};
