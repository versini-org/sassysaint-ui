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
import clsx from "clsx";
import React, { useState } from "react";

import type { ButtonIconProps } from "./ButtonTypes";

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
		const buttonClass = clsx(
			className,
			"p-2 text-sm font-medium sm:text-base focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-slate-300",
			{
				"rounded-full ": !raw,
				"rounded-sm ": raw,
				"text-slate-200 bg-slate-900 hover:bg-slate-800 active:text-slate-300 active:bg-slate-700":
					kind === "dark" && !disabled && !raw,
				"text-slate-200 bg-slate-900": kind === "dark" && disabled && !raw,

				"text-slate-200 bg-slate-500 hover:bg-slate-600 active:text-slate-300 active:bg-slate-700":
					kind === "light" && !disabled && !raw,
				"text-slate-200 bg-slate-500": kind === "light" && disabled && !raw,
				"w-full": fullWidth,
				"disabled:opacity-50 disabled:cursor-not-allowed": disabled,
			},
		);
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

				{label && (
					<FloatingPortal>
						{isOpen && (
							<div
								className="w-max bg-slate-600 text-white text-sm px-2 py-2 rounded-md shadow-md"
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
