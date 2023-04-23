import { MapPane } from "@maticoapp/matico_types/spec";
import { v4 as uuid } from 'uuid'

export const defaults: Partial<MapPane> = {
  name: "Map",
  id: uuid(),
  baseMap: { type: "named", name: "Terrain", affiliation: "mapbox" },

  controls: {
    scale: true,
    geolocate: true,
    navigation: true,
    fullscreen: true
  }
};
