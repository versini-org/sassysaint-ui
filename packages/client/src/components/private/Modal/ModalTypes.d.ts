import { useModal } from "./ModalHooks";

export interface ModalOptions {
	initialOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export type ContextType =
	| (ReturnType<typeof useModal> & {
			setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
			setDescriptionId: React.Dispatch<
				React.SetStateAction<string | undefined>
			>;
	  })
	| null;
