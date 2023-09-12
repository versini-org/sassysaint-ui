import "./styles.css";

import {
	autoUpdate,
	flip,
	FloatingPortal,
	offset,
	shift,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
	useRole,
} from "@floating-ui/react";
import { useState } from "react";

import { Button } from "..";

export const Tooltip = ({ element }) => {
	const [isOpen, setIsOpen] = useState(false);

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: "top",
		// Make sure the tooltip stays on the screen
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(5),
			flip({
				fallbackAxisSideDirection: "start",
			}),
			shift(),
		],
	});

	// Event listeners to change the open state
	const hover = useHover(context, { move: false });
	const focus = useFocus(context);
	const dismiss = useDismiss(context);
	// Role props for screen readers
	const role = useRole(context, { role: "tooltip" });

	// Merge all the interactions into prop getters
	const { getReferenceProps, getFloatingProps } = useInteractions([
		hover,
		focus,
		dismiss,
		role,
	]);

	return (
		<>
			{element ? (
				<>{element}</>
			) : (
				<Button ref={refs.setReference} {...getReferenceProps()}>
					Hover or focus me
				</Button>
			)}

			<FloatingPortal>
				{isOpen && (
					<div
						className="Tooltip"
						ref={refs.setFloating}
						style={floatingStyles}
						{...getFloatingProps()}
					>
						I'm a tooltip!
					</div>
				)}
			</FloatingPortal>
		</>
	);
};
