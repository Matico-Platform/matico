import React from 'react'
import { PaneParts } from "../PaneParts";
import { MaticoControlsPane } from "./MaticoControlsPane";
import { ControlsPaneEditor } from "./ControlEditor";

import { defaults } from "./defaults";
import PropertiesIcon from "@spectrum-icons/workflow/Properties";

const details: PaneParts = {
  pane: MaticoControlsPane,
  sidebarPane: ControlsPaneEditor,
  icon: <PropertiesIcon />,
  defaults,
  docs: "https://www.matico.app/docs/panes/controls_pane"
};

export default details
