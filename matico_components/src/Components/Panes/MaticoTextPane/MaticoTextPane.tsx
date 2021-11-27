import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { MarkdownContnet } from "../../MarkdownContent/MarkdownContent";
import { TextPane } from "matico_spec";
import { Box } from "grommet";

interface MaticoTextPaneInterface extends MaticoPaneInterface {
  font?: string;
  content: string;
}

export const MaticoTextPane: React.FC<MaticoTextPaneInterface> = ({
  content,
  font,
}) => {
  return (
    <Box elevation={"large"} fill={true} overflow={{vertical:'auto'}}>
      <MarkdownContnet>{content}</MarkdownContnet>
    </Box>
  );
};
