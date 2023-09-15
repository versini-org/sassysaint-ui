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
			<DialogContent className="flex flex-col w-full sm:w-[95%] md:max-w-2xl h-full sm:h-auto min-h-[95%] sm:min-h-[10rem] sm:rounded-lg sm:border sm:border-slate-200/10 bg-slate-500">
				<DialogHeading className="p-4 text-xl font-bold flex flex-row-reverse justify-between">
					<DialogClose>
						<IconClose />
					</DialogClose>
					<div>{title}</div>
				</DialogHeading>

				<DialogDescription className="flex flex-col flex-grow p-2 sm:p-4">
					{children}
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};
