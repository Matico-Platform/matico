import React from 'react'
import { PaneParts } from "../PaneParts";
import { MaticoDateTimeSlider } from "./MaticoDateTimeSlider";
import { DateTimeSliderEditor } from "./DateTimeSliderEditor";

import { defaults } from "./defaults";
import Calendar from "@spectrum-icons/workflow/Calendar";

const details: PaneParts = {
  label: "Time Range Selector",
  section: "Control",
  pane: MaticoDateTimeSlider,
  sidebarPane: DateTimeSliderEditor,
  icon: <Calendar />,
  defaults,
  docs: "https://www.matico.app/docs/panes/controls_pane"
};

export default details
