import React from 'react'
import { PaneParts } from "../PaneParts";
import { MaticoContainerPane } from "./MaticoContainerPane";
import { ContainerPaneEditor } from "./ContainerPaneEditor";
import { defaults } from "./defaults";
import Border from "@spectrum-icons/workflow/Border";
import { v4 as uuid } from 'uuid'

const details: PaneParts = {
  label: "Container",
  section: "Layout",
  pane: MaticoContainerPane,
  sidebarPane: ContainerPaneEditor,
  icon: <Border />,
  defaults,
  docs: "https://www.matico.app/docs/panes/container_pane"
};

export type ContainerPresetTypes =
  | "full"
  | "mainSideBar"
  | "row"
  | "column"
  | "tabs";

export default details

export const containerPresetForType = (
  name: string,
  presetType: ContainerPresetTypes
) => {
  switch (presetType) {
    case "full":
      let full = {
        id: uuid(),
        name: name,
        layout: { type: "free", allowOverflow: false },
        type: "container",
        panes: []
      };
      return { container: full, additionalPanes: [] };

    case "column":
      let rowContainer = {
        id: uuid(),
        name: name,
        type: "container",
        layout: {
          type: "linear",
          gap: "small",
          direction: "row",
          justify: "start",
          align: "center",
          allowOverflow: true
        },
        panes: []
      };
      return { container: rowContainer, additionalPanes: [] };

    case "row":
      let columnContainer = {
        id: uuid(),
        name: name,
        type: "container",
        layout: {
          type: "linear",
          gap: "small",
          direction: "column",
          justify: "start",
          align: "center",
          allowOverflow: true
        },
        panes: []
      };
      return { container: columnContainer, additionalPanes: [] };

    case "tabs":
      let tabOne = {
        id: uuid(),
        type: "container",
        name: `${name}: Tab 1`,
        layout: { type: "free", allowOverflow: false },
        panes: []
      };
      let tabTwo = {
        id: uuid(),
        type: "container",
        name: `${name}: Tab 2`,
        layout: { type: "free", allowOverflow: false },
        panes: []
      };
      let tabContainer = {
        id: uuid(),
        name: name,
        type: "container",
        layout: { type: "tabs", tabBarPosition: "horizontal" },
        panes: [
          {
            id: uuid(),
            type: "container",
            paneId: tabOne.id,
            position: { ...FullPosition, width: 100, heigh: 100 }
          },
          {
            id: uuid(),
            type: "container",
            paneId: tabTwo.id,
            position: { ...FullPosition, width: 100, heigh: 100 }
          }
        ]
      };
      return {
        container: tabContainer,
        additionalPanes: [tabOne, tabTwo]
      };

    case "mainSideBar":
      let MainContentPane = {
        id: uuid(),
        type: "container",
        name: `${name}: Main`,
        layout: { type: "free", allowOverflow: false },
        panes: []
      };

      let SideBar = {
        id: uuid(),
        type: "container",
        name: `${name}: SideBar`,
        layout: {
          type: "linear",
          direction: "column",
          gap: "small",
          allowOverflow: true,
          justify: "start",
          align: "center"
        },
        panes: []
      };

      let mainSideBarHorizontal = {
        id: uuid(),
        type: "container",
        name: name,
        layout: {
          type: "linear",
          direction: "row",
          gap: "small",
          justify: "start",
          align: "center",
          allowOverflow: false
        },
        panes: [
          {
            id: uuid(),
            type: "container",
            paneId: MainContentPane.id,
            position: { ...FullPosition, width: 70 }
          },
          {
            id: uuid(),
            type: "container",
            paneId: SideBar.id,
            position: { ...FullPosition, width: 30 }
          }
        ]
      };

      return {
        container: mainSideBarHorizontal,
        additionalPanes: [MainContentPane, SideBar]
      };

    default:
      throw `Unsupported container layout ${presetType}`;
  }
}

