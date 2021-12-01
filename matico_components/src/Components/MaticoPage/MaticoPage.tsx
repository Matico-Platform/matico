import React from "react";
import ReactDom from "react-dom";
import { Page } from "matico_spec";
import { Box } from "grommet";
import { MarkdownContnet } from "../MarkdownContent/MarkdownContent";
import { MaticoSection } from "../MaticoSection/MaticoSection";

interface MaticoPageInterface {
  page: Page;
  editPath?: string;
}
export const MaticoPage: React.FC<MaticoPageInterface> = ({
  page,
  editPath,
}) => (
  <Box fill={true} overflow={{vertical:'auto'}}>
    {page.content && (
      <MarkdownContnet key="content">{page.content}</MarkdownContnet>
    )}
    {page.sections
      .filter((section) => section.panes.length > 0)
      .map((section, index) => (
        <MaticoSection
          key={section.name}
          section={section}
          editPath={`${editPath}.sections.${index}`}
        />
      ))}
  </Box>
);
