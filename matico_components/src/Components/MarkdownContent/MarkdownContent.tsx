import React, { useContext } from "react";
import ReactMarkdown from "react-markdown";
import { Box } from "grommet";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // `rehype-katex`
import { MaticoStateContext } from "../../Contexts/MaticoStateContext/MaticoStateContext";
import { MaticoStateVariable } from "../../Contexts/MaticoStateContext/VariableTypes";
import _ from "lodash";

interface MarkdownContentInferface {}

const regexp = new RegExp('#{(.*)}','g');

export const MarkdownContnet: React.FC<MarkdownContentInferface> = ({
  children,
}) => {
  const { state } = useContext(MaticoStateContext);
  let content = typeof children === typeof "string" ? (children as string) : "";

  const matches = content.matchAll(regexp);
  for (const match of matches) {
    let varName = match[1].split(".")[0];
    let path = match[1].split(".").slice(1).join(".");
    let variable = state.autoVariables.find((v) => v.name === varName);
    if (variable) {
      let value = _.at(variable.value, path);
      if (value) {
        content = content.replace(match[0], `${value}`);
      } else {
        content = content.replace(match[0], "variable undefined");
      }
    } else {
      content = content.replace(match[0], "variable undefined");
    }
  }

  // TODO this is dumb. should be an easier way of only selecting string children
  return (
    <Box>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {content}
      </ReactMarkdown>
    </Box>
  );
};
