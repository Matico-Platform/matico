import React from 'react'
import { PaneParts } from "../PaneParts";
import { MaticoHistogramPane } from "./MaticoHistogramPane";
import { HistogramPaneEditor } from "./HistogramPaneEditor";

import { defaults } from "./defaults";
import HistogramIcon from "@spectrum-icons/workflow/Histogram";

const details: PaneParts = {
  label: "Histogram",
  section: "Vis",
  pane: MaticoHistogramPane,
  sidebarPane: HistogramPaneEditor,
  icon: <HistogramIcon />,
  defaults,
  docs: "https://www.matico.app/docs/panes/histogram_pane"
};

export default details
