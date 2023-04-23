import { ScatterplotPane } from "@maticoapp/matico_types/spec";
import { v4 as uuid } from 'uuid'

export const defaults: Partial<ScatterplotPane> = {
  name: "ScatterplotPane",
  dotColor: { hex: "#5cb2a6" },
  dotSize: 3,
  id: uuid(),
}
