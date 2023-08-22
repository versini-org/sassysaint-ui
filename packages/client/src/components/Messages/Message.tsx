import { IconAssistant, IconCopy, IconUser } from "../Icons";
import { ROLE_ASSISTANT, ROLE_USER } from "../../common/constants";

import { IconCopied } from "../Icons/IconCopied";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type MessageProps = {
	children: string;
	type: string;
};

const renderContent = (content: string, type: string) => {
	return type === ROLE_ASSISTANT ? (
		<ReactMarkdown remarkPlugins={[remarkGfm]} children={content} />
	) : (
		<div className="relative flex flex-col gap-1 md:gap-3 ">
			<div className="flex flex-grow flex-col gap-3">
				<div className="flex flex-col items-start gap-3 overflow-x-auto whitespace-pre-wrap break-words">
					<div className="empty:hidden">{content}</div>
				</div>
			</div>
		</div>
	);
};

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
	({ children, type }: MessageProps, ref) => {
		const [copied, setCopied] = React.useState(false);
		let mainClass, contentClass;
		if (type === ROLE_USER) {
			mainClass = "flex items-start flex-row-reverse";
			contentClass =
				"bubble bubble-user flex min-h-[85px] rounded-b-xl rounded-tl-xl p-4 sm:min-h-0 sm:max-w-md md:max-w-2xl bg-[#0B93F6] text-white";
		} else {
			mainClass = "flex items-start ";
			contentClass =
				"bubble bubble-assistant flex flex-col rounded-b-xl rounded-tr-xl p-4 sm:max-w-md md:max-w-2xl bg-[#E5E5EA] text-black";
		}

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
			<div className={mainClass} ref={ref}>
				<div className="text-slate-300">
					{type === ROLE_ASSISTANT ? <IconAssistant /> : <IconUser />}
				</div>
				<div className={contentClass}>{renderContent(children, type)}</div>

				{type === ROLE_ASSISTANT && (
					<div className="ml-2 mt-1 flex flex-col-reverse gap-2 sm:flex-row">
						<button
							className={
								!copied
									? "text-slate-300 hover:text-blue-700"
									: "text-slate-300"
							}
							type="button"
							onClick={copyToClipboard}
							disabled={copied}
						>
							{copied ? <IconCopied /> : <IconCopy />}
						</button>
					</div>
				)}
			</div>
		);
	},
);
