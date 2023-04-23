import { StaticMapPane } from "@maticoapp/matico_types/spec";
import { v4 as uuid } from 'uuid'

export const defaults: Partial<StaticMapPane> = {
  name: "StaticMap",
  id: uuid(),
  projection: "geoTransverseMercator",
  showGraticule: false,
  rotation: 0
}
