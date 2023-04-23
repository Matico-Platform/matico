
import { DateTimeSliderPane } from "@maticoapp/matico_types/spec";
import { v4 as uuid } from 'uuid'

export const defaults: Partial<DateTimeSliderPane> = {
  name: "DateTimeSlider",
  id: uuid(),
  label: "Date",
};
