export type ButtonProps = {
	children?: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	kind?: "dark" | "light";
	fullWidth?: boolean;
	className?: string;
	slim?: boolean;
	type?: "button" | "submit" | "reset";
	raw?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonIconProps = {
	label?: string;
} & ButtonProps;
