import React from "react";
import { PaneParts } from "../PaneParts";
import { MaticoCategorySelector } from "./MaticoCategorySelectorPane";
import { CategorySelectorEditor } from "./CategorySelectorEditior";
import { defaults } from "./defaults";
import Condition from "@spectrum-icons/workflow/Condition";

export const MaticoCategorySelectorPaneComponents: PaneParts = {
    pane: MaticoCategorySelector,
    sidebarPane: CategorySelectorEditor,
    icon: Condition,
    defaults,
    docs: "https://www.matico.app/docs/panes/category_selector"
};
