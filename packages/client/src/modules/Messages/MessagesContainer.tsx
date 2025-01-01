import { useAuth } from "@versini/auth-provider";
import { ButtonIcon } from "@versini/ui-button";
import { useResizeObserver } from "@versini/ui-hooks";
import { IconDown } from "@versini/ui-icons";
import {
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

import { getMessageContaintWrapperClass } from "../../common/utilities";
import { AppContext } from "../App/AppContext";
import { MessagesContainerHeader } from "./MessagesContainerHeader";
import { MessagesList } from "./MessagesList";

export const MessagesContainer = () => {
	const { isAuthenticated } = useAuth();
	const { state } = useContext(AppContext);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const [scrollContainerRef, rect] = useResizeObserver<HTMLDivElement>();
	const containerClass = getMessageContaintWrapperClass(isAuthenticated);

	const scrollToBottom = useCallback(() => {
		const container = scrollContainerRef.current;
		if (container) {
			const { scrollHeight, clientHeight, scrollTop } = container;
			const scrollAmount = scrollHeight - clientHeight - scrollTop;
			container.scrollBy({
				top: scrollAmount,
				behavior: "smooth",
			});
		}
	}, [scrollContainerRef]);

	const updateButtonVisibility = useCallback(() => {
		const container = scrollContainerRef.current;
		if (container) {
			const { scrollTop, scrollHeight, clientHeight } = container;
			// Check if content overflows and if the user is not scrolled to the bottom
			const isScrollable = scrollHeight > clientHeight;
			// Account for floating-point rounding errors
			const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
			setShowScrollButton(isScrollable && !isAtBottom);
		}
	}, [scrollContainerRef]);

	/**
	 * Update button visibility when the container is resized.
	 */
	useLayoutEffect(() => {
		if (rect && rect.width && state && !state.streaming) {
			updateButtonVisibility();
		}
	}, [rect, state, updateButtonVisibility]);

	/**
	 * Update button visibility when the user scrolls.
	 */
	useEffect(() => {
		const container = scrollContainerRef.current;
		// Attach scroll event
		if (container) {
			container.addEventListener("scroll", updateButtonVisibility);
			return () =>
				container.removeEventListener("scroll", updateButtonVisibility);
		}
	}, [updateButtonVisibility, scrollContainerRef]);

	/**
	 * Update button visibility when content is being streamed.
	 */
	useEffect(() => {
		if (state && state.streaming) {
			updateButtonVisibility();
		}
	}, [state, updateButtonVisibility]);

	const previousStreamingRef = useRef(false);

	/**
	 * Scroll to bottom when streaming starts.
	 */
	useEffect(() => {
		if (state) {
			const handleStreamingChange = () => {
				if (!previousStreamingRef.current && state.streaming) {
					// state.streaming changed from false to true, need to scroll to bottom
					scrollToBottom();
				}
				previousStreamingRef.current = Boolean(state.streaming);
			};
			handleStreamingChange();
		}
	}, [state, scrollToBottom]);

	return (
		<div className={containerClass} ref={scrollContainerRef}>
			{showScrollButton && (
				<div className="bottom-44 z-40 fixed left-1/2 transform -translate-x-1/2">
					<ButtonIcon
						className="bg-white hover:bg-white active:bg-slate-400"
						size="medium"
						mode="dark"
						onClick={scrollToBottom}
					>
						<IconDown monotone size="size-3" className="text-copy-dark" />
					</ButtonIcon>
				</div>
			)}
			<MessagesContainerHeader />
			<MessagesList />
		</div>
	);
};
