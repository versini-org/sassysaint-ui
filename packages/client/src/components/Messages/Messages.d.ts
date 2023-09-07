export type MessagesContainerProps = {
	noHeader?: boolean;
};

export type MessageUserProps = {
	children: string;
};

export type MessageAssistantProps = {
	children: string;
	smoothScrollRef: React.RefObject<HTMLDivElement>;
};
