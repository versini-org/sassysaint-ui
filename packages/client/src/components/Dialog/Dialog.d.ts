import { useDialog } from "./DialogHooks";

export interface DialogOptions {
	initialOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export type ContextType =
	| (ReturnType<typeof useDialog> & {
			setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
			setDescriptionId: React.Dispatch<
				React.SetStateAction<string | undefined>
			>;
	  })
	| null;

export interface DialogTriggerProps {
	children: React.ReactNode;
	asChild?: boolean;
}
