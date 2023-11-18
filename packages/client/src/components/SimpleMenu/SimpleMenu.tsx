import {
	autoUpdate,
	flip,
	FloatingFocusManager,
	FloatingList,
	FloatingNode,
	FloatingPortal,
	FloatingTree,
	offset,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useFloatingNodeId,
	useFloatingTree,
	useInteractions,
	useListItem,
	useListNavigation,
	useMergeRefs,
	useRole,
	useTypeahead,
} from "@floating-ui/react";
import { ButtonIcon } from "@versini/ui-components";
import * as React from "react";

const MenuContext = React.createContext<{
	getItemProps: (
		userProps?: React.HTMLProps<HTMLElement>,
	) => Record<string, unknown>;
	activeIndex: number | null;
	setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
	setHasFocusInside: React.Dispatch<React.SetStateAction<boolean>>;
	isOpen: boolean;
}>({
	getItemProps: () => ({}),
	activeIndex: null,
	setActiveIndex: () => {},
	setHasFocusInside: () => {},
	isOpen: false,
});

interface MenuProps {
	icon?: React.ReactNode;
	label?: string;
	children?: React.ReactNode;
}

export const MenuComponent = React.forwardRef<
	HTMLButtonElement,
	MenuProps & React.HTMLProps<HTMLButtonElement>
>(({ children, label, icon, ...props }, forwardedRef) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [hasFocusInside, setHasFocusInside] = React.useState(false);
	const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

	const elementsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
	const labelsRef = React.useRef<Array<string | null>>([]);
	const parent = React.useContext(MenuContext);

	const tree = useFloatingTree();
	const nodeId = useFloatingNodeId();
	const item = useListItem();

	const { floatingStyles, refs, context } = useFloating<HTMLButtonElement>({
		nodeId,
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: "bottom-start",
		middleware: [offset({ mainAxis: 4, alignmentAxis: 0 }), flip(), shift()],
		whileElementsMounted: autoUpdate,
	});

	const click = useClick(context, {
		event: "mousedown",
		toggle: true,
		ignoreMouse: false,
	});
	const role = useRole(context, { role: "menu" });
	const dismiss = useDismiss(context, { bubbles: true });
	const listNavigation = useListNavigation(context, {
		listRef: elementsRef,
		activeIndex,
		nested: false,
		onNavigate: setActiveIndex,
	});
	const typeahead = useTypeahead(context, {
		listRef: labelsRef,
		onMatch: isOpen ? setActiveIndex : undefined,
		activeIndex,
	});

	const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
		[click, role, dismiss, listNavigation, typeahead],
	);

	// Event emitter allows you to communicate across tree components.
	// This effect closes all menus when an item gets clicked anywhere
	// in the tree.
	React.useEffect(() => {
		if (!tree) return;

		function handleTreeClick() {
			setIsOpen(false);
		}

		function onSubMenuOpen(event: { nodeId: string; parentId: string }) {
			if (event.nodeId !== nodeId && event.parentId === null) {
				setIsOpen(false);
			}
		}

		tree.events.on("click", handleTreeClick);
		tree.events.on("menuopen", onSubMenuOpen);

		return () => {
			tree.events.off("click", handleTreeClick);
			tree.events.off("menuopen", onSubMenuOpen);
		};
	}, [tree, nodeId]);

	React.useEffect(() => {
		if (isOpen && tree) {
			tree.events.emit("menuopen", { nodeId });
		}
	}, [tree, isOpen, nodeId]);

	return (
		<FloatingNode id={nodeId}>
			<ButtonIcon
				noBorder
				label={label || "Open menu"}
				ref={useMergeRefs([refs.setReference, item.ref, forwardedRef])}
				data-open={isOpen ? "" : undefined}
				data-focus-inside={hasFocusInside ? "" : undefined}
				{...getReferenceProps(
					parent.getItemProps({
						...props,
						onFocus(event: React.FocusEvent<HTMLButtonElement>) {
							props.onFocus?.(event);
							setHasFocusInside(false);
							parent.setHasFocusInside(true);
						},
					}),
				)}
			>
				{label}
				{icon}
			</ButtonIcon>

			<MenuContext.Provider
				value={{
					activeIndex,
					setActiveIndex,
					getItemProps,
					setHasFocusInside,
					isOpen,
				}}
			>
				<FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
					{isOpen && (
						<FloatingPortal>
							<FloatingFocusManager
								context={context}
								modal={false}
								initialFocus={0}
								returnFocus
							>
								<div
									ref={refs.setFloating}
									className="rounded-md bg-slate-300 p-4 outline-none sm:p-2"
									style={floatingStyles}
									{...getFloatingProps()}
								>
									{children}
								</div>
							</FloatingFocusManager>
						</FloatingPortal>
					)}
				</FloatingList>
			</MenuContext.Provider>
		</FloatingNode>
	);
});

interface MenuItemProps {
	label: string;
	disabled?: boolean;
}

export const MenuItem = React.forwardRef<
	HTMLButtonElement,
	MenuItemProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ label, disabled, ...props }, forwardedRef) => {
	const menu = React.useContext(MenuContext);
	const item = useListItem({ label: disabled ? null : label });
	const tree = useFloatingTree();
	const isActive = item.index === menu.activeIndex;

	return (
		<button
			{...props}
			ref={useMergeRefs([item.ref, forwardedRef])}
			type="button"
			role="menuitem"
			className="m-0 flex w-full items-center justify-between rounded-md border-none bg-none px-3 py-2 text-left text-base outline-none focus:bg-slate-200 focus:underline disabled:cursor-not-allowed disabled:text-slate-500 sm:py-1"
			tabIndex={isActive ? 0 : -1}
			disabled={disabled}
			{...menu.getItemProps({
				onClick(event: React.MouseEvent<HTMLButtonElement>) {
					props.onClick?.(event);
					tree?.events.emit("click");
				},
				onFocus(event: React.FocusEvent<HTMLButtonElement>) {
					props.onFocus?.(event);
					menu.setHasFocusInside(true);
				},
			})}
		>
			{label}
		</button>
	);
});

export const Menu = React.forwardRef<
	HTMLButtonElement,
	MenuProps & React.HTMLProps<HTMLButtonElement>
>((props, ref) => {
	return (
		<FloatingTree>
			<MenuComponent {...props} ref={ref} />
		</FloatingTree>
	);
});
