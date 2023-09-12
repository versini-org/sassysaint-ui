import { useAuth0 } from "@auth0/auth0-react";

import { CHAT_DETAILS_TITLE } from "../../common/strings";
import { isDev } from "../../common/utilities";
import { IconClose } from "..";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeading,
} from "../Dialog/Dialog";
import { ChatDetailsContent } from "./ChatDetailsContent";

export const ChatDetails = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: any;
}) => {
	const { isAuthenticated } = useAuth0();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				overlayBackground="bg-slate-500 sm:bg-black/[.8]"
				className="flex flex-col w-full sm:w-[95%] md:max-w-2xl min-h-[90%] sm:min-h-[10rem] rounded-lg border border-slate-200/10 bg-slate-400"
			>
				<DialogHeading className="p-4 text-xl font-bold flex flex-row-reverse justify-between">
					<DialogClose>
						<IconClose />
					</DialogClose>
					<div>{CHAT_DETAILS_TITLE}</div>
				</DialogHeading>

				<DialogDescription className="flex flex-col flex-grow p-4">
					<ChatDetailsContent isAuthenticated={isAuthenticated} isDev={isDev} />
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};
