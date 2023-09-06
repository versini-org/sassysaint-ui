export type MessagesContainerProps = {
	noHeader?: boolean;
};

export type actionProps = {
	message: {
		role?: string;
		content?: string;
	};
	usage?: string | number;
	model?: string;
};

export type MessagesContextProps = {
	state?: actionProps[];
	dispatch?: any;
};

export type MessageUserProps = {
	children: string;
};

export type MessageAssistantProps = {
	children: string;
	smoothScrollRef: React.RefObject<HTMLDivElement>;
};
