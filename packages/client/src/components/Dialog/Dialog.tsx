import {
	FloatingFocusManager,
	FloatingOverlay,
	FloatingPortal,
	useId,
	useMergeRefs,
} from "@floating-ui/react";
import * as React from "react";

import { ButtonIcon } from "..";
import type { ButtonProps } from "../Button/ButtonTypes";
import type { DialogOptions } from "./Dialog.d";
import { DialogContext } from "./DialogContext";
import { useDialog, useDialogContext } from "./DialogHooks";

export function Dialog({
	children,
	...options
}: {
	children: React.ReactNode;
} & DialogOptions) {
	const dialog = useDialog(options);
	return (
		<DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>
	);
}

type overlayBackgroundProps = {
	overlayBackground?: string;
};
export const DialogContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLProps<HTMLDivElement> & overlayBackgroundProps
>(function DialogContent(props, propRef) {
	const { context: floatingContext, ...context } = useDialogContext();
	const ref = useMergeRefs([context.refs.setFloating, propRef]);

	if (!floatingContext.open) return null;

	const { overlayBackground, ...rest } = props;
	const overlayClass = overlayBackground
		? `grid place-items-center ${overlayBackground}`
		: "grid place-items-center bg-black sm:bg-black/[.8]";

	return (
		<FloatingPortal>
			<FloatingOverlay className={overlayClass} lockScroll>
				<FloatingFocusManager context={floatingContext}>
					<div
						ref={ref}
						aria-labelledby={context.labelId}
						aria-describedby={context.descriptionId}
						{...context.getFloatingProps(rest)}
					>
						{rest.children}
					</div>
				</FloatingFocusManager>
			</FloatingOverlay>
		</FloatingPortal>
	);
});

export const DialogHeading = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLProps<HTMLHeadingElement>
>(function DialogHeading({ children, ...props }, ref) {
	const { setLabelId } = useDialogContext();
	const id = useId();

	// Only sets `aria-labelledby` on the Dialog root element
	// if this component is mounted inside it.
	React.useLayoutEffect(() => {
		setLabelId(id);
		return () => setLabelId(undefined);
	}, [id, setLabelId]);

	return (
		<h1 {...props} ref={ref} id={id}>
			{children}
		</h1>
	);
});

export const DialogDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLProps<HTMLParagraphElement>
>(function DialogDescription({ children, ...props }, ref) {
	const { setDescriptionId } = useDialogContext();
	const id = useId();

	// Only sets `aria-describedby` on the Dialog root element
	// if this component is mounted inside it.
	React.useLayoutEffect(() => {
		setDescriptionId(id);
		return () => setDescriptionId(undefined);
	}, [id, setDescriptionId]);

	return (
		<div {...props} ref={ref} id={id}>
			{children}
		</div>
	);
});

export const DialogClose = React.forwardRef<
	HTMLButtonElement & ButtonProps,
	ButtonProps
>(function DialogClose(props, ref) {
	const { setOpen } = useDialogContext();
	const { children, ...rest } = props;
	return (
		<ButtonIcon
			label="Close"
			type="button"
			{...rest}
			ref={ref}
			onClick={() => setOpen(false)}
		>
			{children}
		</ButtonIcon>
	);
});
