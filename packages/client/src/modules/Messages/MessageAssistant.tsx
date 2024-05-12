import { Bubble, Spinner } from "@versini/ui-components";
import { useLocalStorage } from "@versini/ui-hooks";
import { useContext } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import {
	LOCAL_STORAGE_CHAT_DETAILS,
	LOCAL_STORAGE_PREFIX,
} from "../../common/constants";
import type { MessageAssistantProps } from "../../common/types";
import { durationFormatter } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

const FOOTER_KEYS = {
	MODEL: "Model",
	PLUGIN: "Plugin",
	PROCESSING_TIME: "Processing time",
};

export const MessageAssistant = ({
	children,
	name,
	loading,
	processingTime,
}: MessageAssistantProps) => {
	const { state } = useContext(AppContext);
	const [showEngineDetails] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_CHAT_DETAILS,
		defaultValue: false,
	});

	return (
		<>
			<div className="h-0.5" />
			{loading ? (
				<Bubble>
					<Spinner type="dots" />
				</Bubble>
			) : (
				<Bubble
					copyToClipboard={children}
					copyToClipboardFocusMode="light"
					footer={{
						[FOOTER_KEYS.MODEL]:
							state && state.model && showEngineDetails ? state.model : null,
						[FOOTER_KEYS.PLUGIN]: name && showEngineDetails ? name : null,
						[FOOTER_KEYS.PROCESSING_TIME]:
							processingTime && showEngineDetails
								? durationFormatter(processingTime)
								: null,
					}}
				>
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						rehypePlugins={[rehypeHighlight]}
					>
						{children}
					</ReactMarkdown>
				</Bubble>
			)}
		</>
	);
};

/**
 * This is required to be able to load the component
 * dynamically using React Lazy and Suspense.
 */
export default MessageAssistant;
