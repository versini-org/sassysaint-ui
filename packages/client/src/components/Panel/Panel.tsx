import React from "react";

import { IconClose } from "..";
import {
	Modal,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalHeading,
} from "../private/Modal/Modal";

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
		<Modal open={open} onOpenChange={onOpenChange}>
			<ModalContent className="flex h-full min-h-[95%] w-full flex-col bg-slate-500 sm:h-auto sm:min-h-[10rem] sm:w-[95%] sm:rounded-lg sm:border sm:border-slate-200/10 md:max-w-2xl">
				<ModalHeading className="flex flex-row-reverse justify-between p-4 text-xl font-bold">
					<ModalClose>
						<IconClose />
					</ModalClose>
					<div>{title}</div>
				</ModalHeading>

				<ModalDescription className="flex flex-grow flex-col p-2 sm:p-4">
					{children}
				</ModalDescription>
			</ModalContent>
		</Modal>
	);
};
