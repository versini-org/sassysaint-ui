import { IconAssistant, IconCopy } from "../Icons";

import { IconCopied } from "../Icons/IconCopied";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type MessageAssistantProps = {
	children: string;
};

export const MessageAssistant = ({ children }: MessageAssistantProps) => {
	const [copied, setCopied] = React.useState(false);

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
		<div className="flex items-start">
			<div className="text-slate-300">
				<IconAssistant />
			</div>
			<div className="bubble bubble-assistant flex flex-col rounded-b-xl rounded-tr-xl p-4 sm:max-w-md md:max-w-2xl bg-[#E5E5EA] text-black">
				<ReactMarkdown remarkPlugins={[remarkGfm]} children={children} />
			</div>

			<div className="ml-2 mt-1 flex flex-col-reverse gap-2 sm:flex-row">
				<button
					className={
						!copied ? "text-slate-300 hover:text-blue-700" : "text-slate-300"
					}
					type="button"
					onClick={copyToClipboard}
					disabled={copied}
				>
					{copied ? <IconCopied /> : <IconCopy />}
				</button>
			</div>
		</div>
	);
};
