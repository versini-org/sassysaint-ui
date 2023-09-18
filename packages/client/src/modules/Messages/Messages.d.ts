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
