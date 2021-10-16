import React from "react";
import { MapPane, LngLat } from "matico_spec";
import type { MaticoPaneInterface } from "../Pane";
import { StaticMap } from "react-map-gl";
import { Box } from "grommet";
import ReactMapGL from "react-map-gl";

interface MaicoMapPaneInterface extends MaticoPaneInterface {
  inital_lng_lat: LngLat;
}

export const MaticoMapPane: React.FC<MaicoMapPaneInterface> = ({inital_lng_lat}) => {
  return (
    <Box fill={true}>
      <StaticMap
      zoom={7}
      latitude={inital_lng_lat.lat}
      longitude={inital_lng_lat.lng}
        mapboxApiAccessToken={
          "pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiY2t1dThkcG1xM3p2ZzJ3bXhlaHFtdThlYiJ9.rmndXXXrC5HAbxg1Ok8XTg"
        }
        mapStyle={
          "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        }
        width={"100%"}
        height={"100%"}
      />
    </Box>
  );
};
