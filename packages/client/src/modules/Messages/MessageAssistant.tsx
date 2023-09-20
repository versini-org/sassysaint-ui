import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { LOCAL_STORAGE_ENGINE } from "../../common/constants";
import { useLocalStorage } from "../../common/hooks";
import type { MessageAssistantProps } from "../../common/types";
import { Button, IconAssistant, IconCopied, IconCopy } from "../../components";

export const MessageAssistant = ({
	smoothScrollRef,
	children,
	name,
}: MessageAssistantProps) => {
	const [copied, setCopied] = React.useState(false);
	const storage = useLocalStorage();
	const showEngineDetails = storage.get(LOCAL_STORAGE_ENGINE) || false;

	// copy to clipboard function
	const copyToClipboard = () => {
		setCopied(true);
		navigator.clipboard.writeText(children);
	};

	// after 3 seconds, reset the copied state
	React.useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 3000);
		}
	}, [copied]);

	return (
		<>
			<div ref={smoothScrollRef} className="h-0.5" />
			<div className="flex items-start">
				<div className="text-slate-300 hidden sm:block">
					<IconAssistant />
				</div>
				<div>
					<div className="flex flex-col rounded-b-xl rounded-tr-xl p-4 sm:max-w-md md:max-w-2xl bg-[#E5E5EA] text-black prose prose-p:my-3 prose-ol:my-3 prose-ul:my-3 prose-blockquote:my-3 prose-indigo prose-ul:prose-li:marker:text-black">
						<ReactMarkdown remarkPlugins={[remarkGfm]} children={children} />
					</div>
					{name && showEngineDetails && (
						<p className="text-end text-xs pr-2 pt-1">Chat engine: {name}</p>
					)}
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