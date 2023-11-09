import { IconCopied, IconCopy, IconDogInShield } from "@versini/ui-components";
import { Button } from "@versini/ui-components";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { LOCAL_STORAGE_ENGINE } from "../../common/constants";
import { useLocalStorage } from "../../common/hooks";
import type { MessageAssistantProps } from "../../common/types";

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
				<div className="hidden text-slate-300 sm:block">
					<IconDogInShield spacing={{ r: 2 }} className="h-6 w-6" />
				</div>
				<div>
					<div className="prose prose-indigo flex flex-col rounded-b-xl rounded-tr-xl bg-[#E5E5EA] p-4 text-black prose-p:my-3 prose-blockquote:my-3 prose-ol:my-3 prose-ul:my-3 prose-ul:prose-li:marker:text-black sm:max-w-md md:max-w-2xl">
						<ReactMarkdown remarkPlugins={[remarkGfm]} children={children} />
					</div>
					{name && showEngineDetails && (
						<p className="pr-2 pt-1 text-end text-xs">Chat engine: {name}</p>
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

/**
 * This is required to be able to load the component
 * dynamically using React Lazy and Suspense.
 */
export default MessageAssistant;
