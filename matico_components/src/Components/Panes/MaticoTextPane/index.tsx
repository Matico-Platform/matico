import React from "react";
import { PaneParts } from "../PaneParts";
import { MaticoTextPane } from "./MaticoTextPane";
import { EditableMaticoTextPane } from "./EditableMaticoTextPane";
import { TextPaneEditor } from "./MaticoTextPaneEditor";
import { defaults } from "./defaults";
import TextIcon from "@spectrum-icons/workflow/Text";

export const MaticoTextPaneComponents: PaneParts = {
    pane: MaticoTextPane,
    editablePane: EditableMaticoTextPane,
    sidebarPane: TextPaneEditor,
    icon: TextIcon,
    defaults,
    docs: "https://www.matico.app/docs/panes/text"
};
