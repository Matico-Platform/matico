import React, { useContext, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
//import "katex/dist/katex.min.css"; // `rehype-katex`
import  _ from "lodash";
import { useAutoVariables } from "../../Hooks/useAutoVariable";
import { Heading, Text, View } from "@adobe/react-spectrum";

interface MarkdownContentInterface{}

const regexp = new RegExp("#{([^}]*)}", "g");

const CustomHeader = ({ children, id, level }) => {
  const variant = `${Math.min(level, 6)}`;
  const align = level === 1 ? "center" : undefined;
  return (
    //@ts-ignore
    <Heading id={id} level={level} alignSelf={align}>
      {children}
    </Heading>
  );
};

const CustomParagraph = ({ children, id }) => {
  return (
    <Text maxWidth="none" width="100%" id={id}>
      {children}{" "}
    </Text>
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

export const MarkdownContent: React.FC<MarkdownContentInterface> = ({
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
    <View
      overflow="none auto"
      width="100%"
    >
      <ReactMarkdown /*@ts-ignore*/
        components={CustomComponents}
        skipHtml={false}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
      >
        {formattedContent}
      </ReactMarkdown>
    </View>
  );
};
