import React from "react";
import ReactDom from "react-dom";
import { Page } from "matico_spec";
import { Box } from "grommet";
import { MarkdownContnet } from "../MarkdownContent/MarkdownContent";

interface MaticoPageInterface {
  page: Page;
}
export const MaticoPage: React.FC<MaticoPageInterface> = ({ page }) => {
  return (
    <Box>
      <MarkdownContnet>{page.content}</MarkdownContnet>
    </Box>
  );
};
