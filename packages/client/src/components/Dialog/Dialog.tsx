import {
	FloatingFocusManager,
	FloatingOverlay,
	FloatingPortal,
	useId,
	useMergeRefs,
} from "@floating-ui/react";
import * as React from "react";

import { Button } from "..";
import type { ButtonProps } from "../Button/Button";
import type { DialogOptions, DialogTriggerProps } from "./Dialog.d";
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

export const DialogTrigger = React.forwardRef<
	HTMLElement,
	React.HTMLProps<HTMLElement> & DialogTriggerProps
>(function DialogTrigger({ children, asChild = false, ...props }, propRef) {
	const context = useDialogContext();
	const childrenRef = (children as any).ref;
	const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

	// `asChild` allows the user to pass any element as the anchor
	if (asChild && React.isValidElement(children)) {
		return React.cloneElement(
			children,
			context.getReferenceProps({
				ref,
				...props,
				...children.props,
				"data-state": context.open ? "open" : "closed",
			}),
		);
	}

	return (
		<button
			ref={ref}
			// The user can style the trigger based on the state
			data-state={context.open ? "open" : "closed"}
			{...context.getReferenceProps(props)}
		>
			{children}
		</button>
	);
});

export const DialogContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLProps<HTMLDivElement>
>(function DialogContent(props, propRef) {
	const { context: floatingContext, ...context } = useDialogContext();
	const ref = useMergeRefs([context.refs.setFloating, propRef]);

	if (!floatingContext.open) return null;

	return (
		<FloatingPortal>
			<FloatingOverlay className="Dialog-overlay" lockScroll>
				<FloatingFocusManager context={floatingContext}>
					<div
						ref={ref}
						aria-labelledby={context.labelId}
						aria-describedby={context.descriptionId}
						{...context.getFloatingProps(props)}
					>
						{props.children}
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
		<Button type="button" {...rest} ref={ref} onClick={() => setOpen(false)}>
			{children}
		</Button>
	);
});
