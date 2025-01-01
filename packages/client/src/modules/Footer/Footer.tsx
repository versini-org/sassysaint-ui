import clsx from "clsx";
import { useContext, useEffect, useRef, useState } from "react";

import { AppContext } from "../App/AppContext";
import { PromptInput } from "../Messages/PromptInput";
import { Toolbox } from "../Toolbox/Toolbox";

export const Footer = () => {
	const { state } = useContext(AppContext);
	const previousStreamingRef = useRef(false);
	const isMobile = window.innerWidth < 400;
	const [footerClass, setFooterClass] = useState(
		isMobile ? "bottom-10" : "top-[245px]",
	);

	/**
	 * Scroll to bottom when streaming starts.
	 */
	useEffect(() => {
		if (isMobile) {
			return;
		}
		if (state) {
			const handleStreamingChange = () => {
				if (!previousStreamingRef.current && state.streaming) {
					// state.streaming changed from false to true, need to scroll to bottom
					setFooterClass("bottom-10");
				}
				previousStreamingRef.current = Boolean(state.streaming);
			};
			handleStreamingChange();
		}
	}, [state, isMobile]);

	useEffect(() => {
		if (isMobile) {
			return;
		}
		if (state && state.messages.length === 0) {
			setFooterClass("top-[245px]");
		}
		if (state && !state.streaming && state.messages.length > 0) {
			setFooterClass("bottom-10");
		}
	}, [state, isMobile]);

	return (
		<footer
			className={clsx(
				"md:mx-auto md:max-w-4xl w-11/12 fixed left-1/2 transform -translate-x-1/2 z-1000",
				footerClass,
			)}
		>
			<Toolbox />
			<PromptInput />
		</footer>
	);
};
