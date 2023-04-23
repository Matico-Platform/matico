import { PieChartPane } from "@maticoapp/matico_types/spec";
import { v4 as uuid } from 'uuid'

export const defaults: Partial<PieChartPane> = {
  name: "Piechart",
  id: uuid(),
};
