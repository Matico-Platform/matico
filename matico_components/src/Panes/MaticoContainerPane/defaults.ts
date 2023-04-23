import { ContainerPane } from "@maticoapp/matico_types/spec";
import { v4 as uuid } from 'uuid'

export const defaults: Partial<ContainerPane> = {
  name: "Container",
  id: uuid()
};
