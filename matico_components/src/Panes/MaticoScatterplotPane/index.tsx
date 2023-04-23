import React from 'react'
import { PaneParts } from "../PaneParts";
import { MaticoScatterplotPane } from "./MaticoScatterplotPane";
import { ScatterplotPaneEditor } from "./ScatterPlotPaneEditor";
import ScatterIcon from "@spectrum-icons/workflow/GraphScatter";

import { defaults } from "./defaults";

const details: PaneParts = {
  label: "Scatter Plot",
  section: "Vis",
  pane: MaticoScatterplotPane,
  sidebarPane: ScatterplotPaneEditor,
  icon: <ScatterIcon />,
  defaults,
  docs: "https://www.matico.app/docs/panes/scatterplot_pane"
};

export default details

