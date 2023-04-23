import React from 'react'
import { PaneParts } from "../PaneParts";
import { MaticoMapPane } from "./MaticoMapPane";
import { MapPaneEditor } from "./MapPaneEditor";
import MapIcon from "@spectrum-icons/workflow/MapView";

import { defaults } from "./defaults";

const details: PaneParts = {
  label: "Map",
  section: "Vis",
  pane: MaticoMapPane,
  sidebarPane: MapPaneEditor,
  icon: <MapIcon />,
  defaults,
  docs: "https://www.matico.app/docs/panes/map_pane"
};

export default details
