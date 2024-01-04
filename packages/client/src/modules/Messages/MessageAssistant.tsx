import {
	Bubble,
	Button,
	IconCopied,
	IconCopy,
	Spinner,
} from "@versini/ui-components";
import React, { useContext } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { LOCAL_STORAGE_ENGINE } from "../../common/constants";
import { useLocalStorage } from "../../common/hooks";
import type { MessageAssistantProps } from "../../common/types";
import { AppContext } from "../App/AppContext";

export const MessageAssistant = ({
	smoothScrollRef,
	children,
	name,
	loading,
	processingTime,
}: MessageAssistantProps) => {
	const { state } = useContext(AppContext);
	const [copied, setCopied] = React.useState(false);
	const storage = useLocalStorage();
	const showEngineDetails = storage.get(LOCAL_STORAGE_ENGINE) || false;

	// copy to clipboard function
	const copyToClipboard = () => {
		setCopied(true);
		if (children) {
			navigator.clipboard.writeText(children);
		}
	};

	// after 3 seconds, reset the copied state
	React.useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 3000);
		}
	}, [copied]);

	return loading ? (
		<>
			<div ref={smoothScrollRef} className="h-0.5" />
			<Bubble kind="left">
				<Spinner type="dots" />
			</Bubble>
		</>
	) : (
		<>
			<div ref={smoothScrollRef} className="h-0.5" />
			<div className="flex items-start">
				<div>
					<Bubble
						kind="left"
						footer={{
							Model:
								state && state.model && showEngineDetails ? state.model : null,
							Plugin: name && showEngineDetails ? name : null,
							["Processing time"]:
								processingTime && showEngineDetails
									? `${processingTime}ms`
									: null,
						}}
					>
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							{children}
						</ReactMarkdown>
					</Bubble>
				</div>

				<div className="ml-2 mt-1 flex flex-col-reverse gap-2 sm:flex-row">
					<Button
						raw
						className={
							!copied
								? "text-slate-300 hover:text-slate-400 active:text-slate-500"
								: "text-slate-300"
						}
						onClick={copyToClipboard}
						disabled={copied}
					>
						{copied ? <IconCopied /> : <IconCopy />}
					</Button>
				</div>
			</div>
		</>
	);
};

/**
 * This is required to be able to load the component
 * dynamically using React Lazy and Suspense.
 */
export default MessageAssistant;
