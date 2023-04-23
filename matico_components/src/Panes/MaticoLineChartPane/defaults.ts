import { LineChartPane } from "@maticoapp/matico_types/spec";
import { v4 as uuid } from 'uuid'

export const defaults: Partial<LineChartPane> = {
  name: "Line Chart",
  id: uuid(),
  lineColor: { hex: "#48ec50" },
  lineWidth: 5
};
