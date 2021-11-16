import React, { useContext, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Box } from "grommet";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // `rehype-katex`
import _ from "lodash";
import { useAutoVariables } from "../../Hooks/useAutoVariable";

interface MarkdownContentInferface {}

const regexp = new RegExp("#{(.*)}", "g");

export const MarkdownContnet: React.FC<MarkdownContentInferface> = ({
  children,
}) => {
  let content = typeof children === typeof "string" ? (children as string) : "";

  const requiredVariables = useMemo(() => {
    const matches = content.matchAll(regexp);
    const result = [];
    for (const match of matches) {
      let name = match[1].split(".")[0];
      let path = match[1].split(".").slice(1).join(".");
      result.push({
        name,
        path,
        match: match[0],
      });
    }
    return result;
  }, [content]);

  const autoVariables = useAutoVariables(
    requiredVariables.map((v) => ({ name: v.name }))
  );

  const formattedContent = useMemo(() => {
    return requiredVariables.reduce((agg, varDetails) => {
      let variable = autoVariables[varDetails.name];
      if (variable) {
        let value = _.at(variable.value, varDetails.path);
        if (value) {
          agg = agg.replace(varDetails.match, `${value}`);
        } else {
          agg = agg.replace(varDetails.match, `(varaible undefined)`);
        }
        return agg;
      } else {
        agg = agg.replace(varDetails.match, `(varaible undefined)`);
      }
      return agg;
    }, content);
  }, [
    content,
    JSON.stringify(requiredVariables),
    JSON.stringify(autoVariables),
  ]);

  return (
    <Box>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {formattedContent}
      </ReactMarkdown>
    </Box>
  );
};
