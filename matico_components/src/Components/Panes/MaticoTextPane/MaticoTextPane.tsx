import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { MarkdownContnet } from "../../MarkdownContent/MarkdownContent";
import { TextPane } from "matico_spec";
import { Box } from "grommet";

interface MaticoTextPaneInterface extends MaticoPaneInterface {
  background?: string;
  font?: string;
  content: string;
}

export const MaticoTextPane: React.FC<MaticoTextPaneInterface> = ({
  background,
  content,
  font,
}) => {
  const backgroundColor = background
    ? background
    : { dark: "dark-2", light: "light-2" };
    console.log("redering TextPane")
  return (
    <Box background={backgroundColor} elevation={"large"} fill={true} overflow={{vertical:'auto'}}>
      <MarkdownContnet>{content}</MarkdownContnet>
    </Box>
  );
};
