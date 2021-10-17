import React from "react";
import ReactMarkdown from "react-markdown";
import { Box } from "grommet";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you

interface MarkdownContentInferface {}
export const MarkdownContnet: React.FC<MarkdownContentInferface> = ({
  children,
}) => {
  // TODO this is dumb. should be an easier way of only selecting string children
  return (
    <Box>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {typeof children === typeof "string" ? (children as string) : ""}
      </ReactMarkdown>
    </Box>
  );
};
