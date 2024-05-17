import "katex/dist/katex.min.css";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const LazyReactMarkdownWithExtra = ({
	content,
}: { content: string | undefined }) => {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm, remarkMath]}
			rehypePlugins={[rehypeHighlight, rehypeKatex]}
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
