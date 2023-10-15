import React from "react";

import { IconClose } from "..";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeading,
} from "../private/Dialog/Dialog";

export const Panel = ({
	open,
	onOpenChange,
	title,
	children,
}: {
	open: boolean;
	onOpenChange: any;
	title: string;
	children: React.ReactNode;
}) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex h-full min-h-[95%] w-full flex-col bg-slate-500 sm:h-auto sm:min-h-[10rem] sm:w-[95%] sm:rounded-lg sm:border sm:border-slate-200/10 md:max-w-2xl">
				<DialogHeading className="flex flex-row-reverse justify-between p-4 text-xl font-bold">
					<DialogClose>
						<IconClose />
					</DialogClose>
					<div>{title}</div>
				</DialogHeading>

				<DialogDescription className="flex flex-grow flex-col p-2 sm:p-4">
					{children}
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};
