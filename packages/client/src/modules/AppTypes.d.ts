export type MessageProps = {
	role?: string;
	content?: string;
};

export type StateProps = {
	model: string;
	usage: string | number;
	messages: { message: MessageProps }[];
};

export type ActionProps = {
	type: string;
	payload?: {
		model?: string;
		usage?: number;
		message?: MessageProps;
	};
};

export type AppContextProps = {
	state?: StateProps;
	dispatch?: any;
};
