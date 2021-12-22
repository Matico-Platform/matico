import React, { useContext, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Box, Heading, Paragraph } from "grommet";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
//import "katex/dist/katex.min.css"; // `rehype-katex`
import  _ from "lodash";
import { useAutoVariables } from "../../Hooks/useAutoVariable";

interface MarkdownContentInferface {}

const regexp = new RegExp("#{([^}]*)}", "g");

const CustomHeader = ({ children, id, level }) => {
  const variant = `${Math.min(level, 6)}`;
  const align = level === 1 ? "center" : undefined;
  return (
    //@ts-ignore
    <Heading id={id} level={variant} textAlign={align}>
      {children}
    </Heading>
  );
};

const CustomParagraph = ({ children, id }) => {
  return (
    <Paragraph style={{maxWidth:"none", width:"100%"}} id={id}>
      {children}{" "}
    </Paragraph>
  );
};

const CustomComponents = {
  h1: CustomHeader,
  h2: CustomHeader,
  h3: CustomHeader,
  h4: CustomHeader,
  h5: CustomHeader,
  h6: CustomHeader,
  p: CustomParagraph,
};

export const MarkdownContnet: React.FC<MarkdownContentInferface> = ({
  children,
}) => {
  let content = typeof children === typeof "string" ? (children as string) : "";

  const requiredVariables = useMemo(() => {
    const matches = content.matchAll(regexp);
    const result = [];
    for (const match of matches) {
      console.log("match is ",match)
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
    <Box
      style={{ textAlign: "start" }}
      pad="small"
    margin="none"
      overflow={{ vertical: "auto" }}
    >
      <ReactMarkdown /*@ts-ignore*/
        components={CustomComponents}
        skipHtml={false}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
      >
        {formattedContent}
      </ReactMarkdown>
    </Box>
  );
};
