import React from "react";
import { PaneParts } from "../PaneParts";
import { MaticoSwitchesPane } from "./MaitcoSwitchesPane";
import { SwitchesPaneEditor } from "./SwitchesPaneEditor";
import { defaults } from "./defaults";
import Boolean from "@spectrum-icons/workflow/Boolean";

export const MaticoSwitchesPaneComponents: PaneParts = {
    pane: MaticoSwitchesPane,
    sidebarPane: SwitchesPaneEditor,
    icon: Boolean,
    defaults,
    docs: "https://www.matico.app/docs/panes/switches"
};
