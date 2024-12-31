import "katex/dist/katex.min.css";

import { ButtonCopy } from "@versini/ui-button";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
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
						<>
							<Flexgrid alignHorizontal="flex-end">
								<FlexgridItem>
									<ButtonCopy
										copyToClipboard={() => handleCopyClick(node)}
										labelRight="copy code"
										radius="small"
										className="mb-2 px-1"
									/>
								</FlexgridItem>
							</Flexgrid>

							<pre
								{...node}
								style={{ marginTop: 0, marginBottom: 0 }}
								className="text-xs"
							></pre>
						</>
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
