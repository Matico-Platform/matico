import React from 'react'
import { PaneParts } from "../PaneParts";
import { MaticoStaticMapPane } from "./MaticoStaticMapPane";
import { StaticMapPaneEditor } from "./StaticMapEditor";
import MapIcon from "@spectrum-icons/workflow/MapView";

import { defaults } from "./defaults";

const details: PaneParts = {
  label: "Static Map",
  section: "Vis",
  pane: MaticoStaticMapPane,
  sidebarPane: StaticMapPaneEditor,
  icon: <MapIcon />,
  defaults,
  docs: "https://www.matico.app/docs/panes/scatterplot_pane"
};

export default details

