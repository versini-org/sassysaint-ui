import "katex/dist/katex.min.css";

import { ButtonCopy } from "@versini/ui-button";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { visit } from "unist-util-visit";

interface PreNode {
	node?: any;
	position: object;
	properties: object;
	tagName: string;
	type: string;
}

const captureRawCode = () => (tree: any) => {
	visit(tree, "element", (node: any) => {
		if (node.tagName === "code" && node.children?.[0]?.value) {
			node.properties["data-raw-code"] = node.children[0].value;
		}
	});
};

const LazyReactMarkdownWithExtra = ({
	content,
}: { content: string | undefined }) => {
	const handleCopyClick = (pre: any): string => {
		return pre.children.props["data-raw-code"] || "";
	};

	return (
		<ReactMarkdown
			components={{
				pre: (node: PreNode) => {
					return (
						<div className="flex flex-row gap-2">
							<pre
								{...node}
								style={{ marginTop: 0, marginBottom: 0 }}
								className="text-xs"
							></pre>
							{/* The extra div is needed to prevent flex from squashing the button */}
							<div>
								<ButtonCopy copyToClipboard={() => handleCopyClick(node)} />
							</div>
						</div>
					);
				},
			}}
			remarkPlugins={[remarkGfm, remarkMath]}
			rehypePlugins={[captureRawCode, rehypeHighlight, rehypeKatex]}
		>
			{content}
		</ReactMarkdown>
	);
};

/**
 * This is required to be able to load the component
 * dynamically using React Lazy and Suspense.
 */
export default LazyReactMarkdownWithExtra;
