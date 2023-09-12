import clsx from "clsx";
import React from "react";

import type { ButtonProps } from "./ButtonTypes";
import { getButtonClasses, TYPE_BUTTON } from "./utilities";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			children,
			onClick,
			disabled = false,
			kind = "dark",
			fullWidth = false,
			className,
			slim = false,
			type = "button",
			raw = false,
			"aria-label": ariaLabel,
		},
		ref,
	) => {
		const buttonClass = getButtonClasses({
			type: TYPE_BUTTON,
			kind,
			fullWidth,
			disabled,
			raw,
			className,
			slim,
		});
		clsx(
			className,
			"text-sm font-medium sm:text-base focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-slate-300",
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
				"px-4 py-1": slim && !raw,
				"px-4 py-2": !slim && !raw,
				"disabled:opacity-50 disabled:cursor-not-allowed": disabled,
			},
		);

		return (
			<button
				ref={ref}
				className={buttonClass}
				onClick={onClick}
				disabled={disabled}
				type={type}
				aria-label={ariaLabel}
			>
				{children}
			</button>
		);
	},
);
