import React from "react";
import { MapPane, LngLat} from "matico_spec";
import type { MaticoPaneInterface } from "../Pane";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { Box } from "grommet";
import ReactMapGL from "react-map-gl";

interface MaicoMapPaneInterface extends MaticoPaneInterface {
  inital_lng_lat: LngLat;
  //TODO WE should properly type this from the matico_spec library. Need to figure out the Typescript integration better or witx
  base_map? :any;
}

function getNamedStyleJSON(style: string) {
  console.log("Getting style json for ", style);
  switch (style) {
    case "CartoDBPositron":
      return "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
    case "CartoDBVoyager":
      return "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
    case "CartoDBDarkMatter":
      return "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
    case "Light":
      return "mapbox://styles/mapbox/light-v10";
    case "Dark":
      return "mapbox://styles/mapbox/dark-v10";
    case "Satelite":
      return "mapbox://styles/mapbox/satellite-v9";
    case "Terrain":
      return "mapbox://styles/mapbox/outdoors-v11";
    case "Streets":
      return "mapbox://styles/mapbox/streets-v11";
    default:
      return "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
  }
}


export const MaticoMapPane: React.FC<MaicoMapPaneInterface> = ({
  inital_lng_lat,
  base_map 
}) => {

  let styleJSON = null;

  if(base_map){
    if(base_map.Named){
      styleJSON = getNamedStyleJSON(base_map.Named)
    }
    else if (base_map.StyleJSON){
      styleJSON = base_map.StyleJSON
    }
  }



  return (
    <Box fill={true}>
      <DeckGL
        width={"100%"}
        height={"100%"}
        initialViewState={{
          longitude: inital_lng_lat.lng,
          latitude: inital_lng_lat.lat,
          zoom: 7,
        }}
        controller={true}
      >
        <StaticMap
          mapboxApiAccessToken={
            "pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiY2t1dThkcG1xM3p2ZzJ3bXhlaHFtdThlYiJ9.rmndXXXrC5HAbxg1Ok8XTg"
          }
          mapStyle={
            styleJSON ?  styleJSON : "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          }
          width={"100%"}
          height={"100%"}
        />
      </DeckGL>
    </Box>
  );
};
