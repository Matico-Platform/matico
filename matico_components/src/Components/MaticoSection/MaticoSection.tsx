import React from "react";
import { Section } from "@maticoapp/matico_spec";
import { Pane } from "Components/Panes/Pane";
import { selectPane } from "Utils/paneEngine";
import { selectLayout } from "Utils/layoutEngine";

interface MaticoSectionInterface {
  section: Section;
  editPath?: string;
}

export const MaticoSection: React.FC<MaticoSectionInterface> = ({
  section,
  editPath,
}) => {
  let LayoutEngine = selectLayout(section.layout);
  // console.log('SECTION', section.panes, section.panes.length && selectPane(section.panes[0], ''))
  // console.log(section.panes)
  return (
    <>
      <LayoutEngine>
        {section.panes
          .filter((p: Pane) => p)
          .map((pane: Pane, index: number) =>
            selectPane(pane, `${editPath}.panes.${index}`)
          )}
      </LayoutEngine>
    </>
  );
};