import React from 'react'
import { PaneParts } from "../PaneParts";
import { MaticoCategorySelector } from "./MaticoCategorySelectorPane";
import { CategorySelectorEditor } from "./CategorySelectorEditior";
import { defaults } from "./defaults";
import Condition from "@spectrum-icons/workflow/Condition";
import { withLinkedCategorySelector } from './CategorySelectorWrapper';
import { registerVariables } from './CategorySelectorVariables';

const details: PaneParts = {
  label: "Map",
  section: "Vis",
  wrapper: withLinkedCategorySelector,
  pane: MaticoCategorySelector,
  registerVariables: registerVariables,
  sidebarPane: CategorySelectorEditor,
  icon: <Condition />,
  defaults,
  docs: "https://www.matico.app/docs/panes/category_selector"
};

export default details
