import React from "react";
import ReactDom from "react-dom";
import { Page } from "@maticoapp/matico_spec";
import { Box } from "grommet";
import { MarkdownContent } from "../MarkdownContent/MarkdownContent";
import { MaticoSection } from "../MaticoSection/MaticoSection";
import {Route,Switch} from "react-router";


interface MaticoPageInterface {
  page: Page;
  editPath?: string;
}
export const MaticoPage: React.FC<MaticoPageInterface> = ({
  page,
  editPath,
}) => (
  <Box fill={true} overflow={{ vertical: 'auto' }}>
    {page.content && (
      <MarkdownContent key="content">{page.content}</MarkdownContent>
    )}
    <Switch>
    {page.sections
      .filter((section) => section.panes.length > 0)
      .map((section, index) => (
        <Route
          path={section.name}
          exact={true}
          key={page.path}
        >
          <MaticoSection
            key={section.name}
            section={section}
            editPath={`${editPath}.sections.${index}`}
          />
        </Route>
      ))}
      </Switch>
  </Box>
);
