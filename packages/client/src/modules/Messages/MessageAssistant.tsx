import { Bubble, Spinner } from "@versini/ui-components";
import { useContext } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { LOCAL_STORAGE_ENGINE } from "../../common/constants";
import { useLocalStorage } from "../../common/hooks";
import type { MessageAssistantProps } from "../../common/types";
import { AppContext } from "../App/AppContext";

const FOOTER_KEYS = {
	MODEL: "Model",
	PLUGIN: "Plugin",
	PROCESSING_TIME: "Processing time",
};

export const MessageAssistant = ({
	smoothScrollRef,
	children,
	name,
	loading,
	processingTime,
}: MessageAssistantProps) => {
	const { state } = useContext(AppContext);
	const storage = useLocalStorage();
	const showEngineDetails = storage.get(LOCAL_STORAGE_ENGINE) || false;

	return loading ? (
		<>
			<div ref={smoothScrollRef} className="h-0.5" />
			<Bubble>
				<Spinner type="dots" />
			</Bubble>
		</>
	) : (
		<>
			<div ref={smoothScrollRef} className="h-0.5" />
			<Bubble
				copyToClipboard={children}
				footer={{
					[FOOTER_KEYS.MODEL]:
						state && state.model && showEngineDetails ? state.model : null,
					[FOOTER_KEYS.PLUGIN]: name && showEngineDetails ? name : null,
					[FOOTER_KEYS.PROCESSING_TIME]:
						processingTime && showEngineDetails ? `${processingTime}ms` : null,
				}}
			>
				<ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
			</Bubble>
		</>
	);
};

/**
 * This is required to be able to load the component
 * dynamically using React Lazy and Suspense.
 */
export default MessageAssistant;
