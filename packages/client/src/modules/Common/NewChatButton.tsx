import { ButtonIcon } from "@versini/ui-button";
import { IconAdd, IconClose } from "@versini/ui-icons";
import type { ButtonIconTypes } from "@versini/ui-types";

import { useContext, useEffect, useRef } from "react";
import { ACTION_RESET } from "../../common/constants";
import { AppContext } from "../App/AppContext";

export const NewChatButton = ({
	mode = "light",
	focusMode = "light",
	radius = "small",
}: Pick<ButtonIconTypes.Props, "mode" | "focusMode" | "radius">) => {
	const { state, dispatch } = useContext(AppContext);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const buttonFocusedRef = useRef(false);

	const newChatPrimaryAction = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch({
			type: ACTION_RESET,
		});
	};

	/**
	 * Focus the clear button when the chat is streaming,
	 * but only if it was not manually focused before.
	 */
	useEffect(() => {
		if (
			state?.streaming === true &&
			!buttonFocusedRef.current &&
			buttonRef.current
		) {
			buttonFocusedRef.current = true;
			buttonRef.current.focus();
		}

		if (state?.streaming === false) {
			buttonFocusedRef.current = false;
			buttonRef.current?.blur();
		}
	}, [state]);

	return (
		<ButtonIcon
			noBorder
			radius={radius}
			mode={mode}
			focusMode={focusMode}
			ref={buttonRef}
			onClick={newChatPrimaryAction}
		>
			{state?.streaming ? (
				<IconClose size="size-4" monotone />
			) : (
				<IconAdd size="size-4" monotone />
			)}
		</ButtonIcon>
	);
};
