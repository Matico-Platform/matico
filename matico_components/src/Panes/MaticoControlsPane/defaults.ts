import { ControlsPane } from "@maticoapp/matico_types/spec";
import { v4 as uuid } from 'uuid'

export const defaults: Partial<ControlsPane> = {
  name: "CotrolsPane",
  id: uuid()
};
