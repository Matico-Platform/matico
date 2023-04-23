import React from 'react'
import { PaneParts } from "../PaneParts";
import { MaticoPieChartPane } from "./MaticoPieChartPane";
import { PieChartPaneEditor } from "./PieChartPaneEditor";
import PieChartIcon from "@spectrum-icons/workflow/GraphPie";

import { defaults } from "./defaults";

const details: PaneParts = {
  label: "Pie Chart",
  section: "Vis",
  pane: MaticoPieChartPane,
  sidebarPane: PieChartPaneEditor,
  icon: <PieChartIcon />,
  defaults,
  docs: "https://www.matico.app/docs/panes/pie_chart"
};

export default details

