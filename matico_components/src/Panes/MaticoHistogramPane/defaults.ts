import { HistogramPane } from "@maticoapp/matico_types/spec";
import { v4 as uuid } from 'uuid'

export const defaults: Partial<HistogramPane> = {
  name: "Histogram",
  id: uuid(),
  color: { hex: "#6dd0fb" },
  maxbins: 20
};
