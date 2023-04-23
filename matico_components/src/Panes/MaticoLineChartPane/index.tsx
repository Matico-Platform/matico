import React from 'react'
import { PaneParts } from "../PaneParts";
import { MaticoLineChartPane } from "./MaticoLineChartPane";
import { LineChartPaneEditor } from "./LineChartPaneEditor";

import { defaults } from "./defaults";
import LineChartIcon from "@spectrum-icons/workflow/GraphTrend";

const details: PaneParts = {
  label: "Line Chart",
  section: "Vis",
  pane: MaticoLineChartPane,
  sidebarPane: LineChartPaneEditor,
  icon: <LineChartIcon />,
  defaults,
  docs: "https://www.matico.app/docs/panes/line_chart_pane"
};

export default details
