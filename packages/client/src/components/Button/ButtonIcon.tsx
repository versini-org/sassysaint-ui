import {
	autoUpdate,
	flip,
	FloatingPortal,
	offset,
	shift,
	useDismiss,
	useFloating,
	useHover,
	useInteractions,
	useMergeRefs,
	useRole,
} from "@floating-ui/react";
import React, { useState } from "react";

import type { ButtonIconProps } from "./ButtonTypes";
import { getButtonClasses, TYPE_ICON } from "./utilities";

// function to get the viewport width
function getViewportWidth() {
	return Math.max(
		document.documentElement.clientWidth || 0,
		window.innerWidth || 0,
	);
}

export const ButtonIcon = React.forwardRef<HTMLButtonElement, ButtonIconProps>(
	(
		{
			children,
			onClick,
			disabled = false,
			kind = "dark",
			fullWidth = false,
			className,
			type = "button",
			raw = false,
			"aria-label": ariaLabel,
			label,
		},
		ref,
	) => {
		const buttonClass = getButtonClasses({
			type: TYPE_ICON,
			kind,
			fullWidth,
			disabled,
			raw,
			className,
		});

		const viewportWidth = getViewportWidth();
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
		const hover = useHover(context, {
			move: false,
			delay: {
				open: 1000,
				close: 500,
			},
		});

		const dismiss = useDismiss(context);
		// Role props for screen readers
		const role = useRole(context, { role: "tooltip" });

		// Merge all the interactions into prop getters
		const { getReferenceProps, getFloatingProps } = useInteractions([
			hover,
			dismiss,
			role,
		]);

		const allRef = useMergeRefs([refs.setReference, ref]);

		const showTooltip = label && viewportWidth > 640;

		return (
			<>
				<button
					ref={allRef}
					className={buttonClass}
					onClick={onClick}
					disabled={disabled}
					type={type}
					aria-label={ariaLabel}
					{...getReferenceProps()}
				>
					{children}
				</button>

				{showTooltip && (
					<FloatingPortal>
						{isOpen && (
							<div
								className="w-max bg-slate-600 text-white text-sm px-2 py-2 rounded-md shadow-md border border-gray-400"
								ref={refs.setFloating}
								style={floatingStyles}
								{...getFloatingProps()}
							>
								{label}
							</div>
						)}
					</FloatingPortal>
				)}
			</>
		);
	},
);
