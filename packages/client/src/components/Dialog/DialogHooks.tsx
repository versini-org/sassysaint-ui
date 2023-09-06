import {
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
} from "@floating-ui/react";
import * as React from "react";

import type { DialogOptions } from "./Dialog.d";
import { DialogContext } from "./DialogContext";

export function useDialog({
	initialOpen = false,
	open: controlledOpen,
	onOpenChange: setControlledOpen,
}: DialogOptions = {}) {
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
	const [labelId, setLabelId] = React.useState<string | undefined>();
	const [descriptionId, setDescriptionId] = React.useState<
		string | undefined
	>();

	const open = controlledOpen ?? uncontrolledOpen;
	const setOpen = setControlledOpen ?? setUncontrolledOpen;

	const data = useFloating({
		open,
		onOpenChange: setOpen,
	});

	const context = data.context;

	const click = useClick(context, {
		enabled: controlledOpen == null,
	});
	const dismiss = useDismiss(context, {
		outsidePress: false,
		outsidePressEvent: "mousedown",
	});
	const role = useRole(context);

	const interactions = useInteractions([click, dismiss, role]);

	return React.useMemo(
		() => ({
			open,
			setOpen,
			...interactions,
			...data,
			labelId,
			descriptionId,
			setLabelId,
			setDescriptionId,
		}),
		[open, setOpen, interactions, data, labelId, descriptionId],
	);
}

export const useDialogContext = () => {
	const context = React.useContext(DialogContext);

	if (context == null) {
		throw new Error("Dialog components must be wrapped in <Dialog />");
	}

	return context;
};
