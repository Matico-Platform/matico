import React, { useState } from "react";
import { View } from "matico_spec";
import type { MaticoPaneInterface } from "../Pane";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { Box } from "grommet";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";

import { MaticoMapLayer } from "./MaticoMapLayer";

interface MaicoMapPaneInterface extends MaticoPaneInterface {
  view: View;
  //TODO WE should properly type this from the matico_spec library. Need to figure out the Typescript integration better or witx
  base_map?: any;
  layers?: Array<any>;
}

function getNamedStyleJSON(style: string) {
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
  view,
  base_map,
  name,
  layers,
}) => {
  const [mapLayers, setMapLayers] = useState([]);

  const updateLayer = (layer) => {
    if (mapLayers.map((l) => l.id).includes(layer.id)) {
      setMapLayers(mapLayers.map((l) => (l.id=== layer.id? layer : l)));
    } else {
      setMapLayers([...mapLayers, layer]);
    }
  };

  const [currentView, updateView] = useAutoVariable({
    //@ts-ignore
    name: view.var ? view.var : `${name}_map_loc`,
    //@ts-ignore
    type: view.var ? undefined : "mapLocVar",
    //@ts-ignore
    initialValue: view.var ? undefined : view,
    //@ts-ignore
    bind: view.var ? view.bind : true,
  });

  //TODO clean this up and properly type
  const updateViewState = (viewStateUpdate: any) => {
    const viewState = viewStateUpdate.viewState;
    updateView({
      lat: viewState.latitude,
      lng: viewState.longitude,
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing,
    });
  };

  let styleJSON = null;

  if (base_map) {
    if (base_map.Named) {
      styleJSON = getNamedStyleJSON(base_map.Named);
    } else if (base_map.StyleJSON) {
      styleJSON = base_map.StyleJSON;
    }
  }

  return (
    <Box fill={true}>
      {currentView && (
        <>
          <DeckGL
            width={"100%"}
            height={"100%"}
            initialViewState={{
              latitude: currentView.lat,
              longitude: currentView.lng,
              zoom: currentView.zoom,
              ...currentView,
            }}
            controller={true}
            onViewStateChange={updateViewState}
            layers={mapLayers}
          >
            <StaticMap
              mapboxApiAccessToken={
                "pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiY2t1dThkcG1xM3p2ZzJ3bXhlaHFtdThlYiJ9.rmndXXXrC5HAbxg1Ok8XTg"
              }
              mapStyle={
                styleJSON
                  ? styleJSON
                  : "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
              }
              width={"100%"}
              height={"100%"}
            />
          </DeckGL>
          {layers.map((l) => (
            <MaticoMapLayer
              key={l.name}
              name={l.name}
              source={l.source}
              style={l.style}
              onUpdate={updateLayer}
              mapName={name}
            />
          ))}
        </>
      )}
    </Box>
  );
};
