import React, { useEffect, useContext } from "react";
import { MapPane, View } from "matico_spec";
import type { MaticoPaneInterface } from "../Pane";
import { StaticMap } from "react-map-gl";
import {
  MaticoStateContext,
  MaticoStateActionType,
} from "../../../Contexts/MaticoStateContext/MaticoStateContext";
import DeckGL from "@deck.gl/react";
import { Box } from "grommet";
import ReactMapGL from "react-map-gl";
import { MapLocVar } from "../../../Contexts/MaticoStateContext/VariableTypes";
import { MaticoDataContext } from "../../../Contexts/MaticoDataContext/MaticoDataContext";
import { GeoJsonLayer } from "@deck.gl/layers";
import {
  useAutoVariable,
  useAutoVariables,
} from "../../../Hooks/useAutoVariable";
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
  const { state, dispatch } = useContext(MaticoStateContext);
  const { state: dataState } = useContext(MaticoDataContext);

  const hoverVarConfig = layers.map((layer) => ({
    name: `${name}_map_${layer.name}_hover`,
    type: "any",
    value: null,
  }));

  const clickVarConfig = layers.map((layer) => ({
    name: `${name}_map_${layer.name}_click`,
    type: "any",
    value: null,
  }));

  const autoVarConfig = [...hoverVarConfig, ...clickVarConfig];

  const layerVariables = useAutoVariables(autoVarConfig);

  const mapLayers = layers
    .sort((a, b) => a.order - b.order)
    .map((layer) => {
      const dataset = dataState.datasets.find((d) => {
        return d.name === layer.source.name;
      });

      if (!dataset || !dataset.isReady()) {
        return;
      }
      return new GeoJsonLayer({
        id: layer.name,
        data: dataset.getData(),
        filled: true,
        getFillColor: layer.style.color ? layer.style.color : [255, 0, 0, 100],
        pointRadiusUnits: "pixels",
        getPointRadius: layer.style.size ? layer.style.size : 20,
        getBorderColor: [0, 255, 0, 100],
        stroked: true,
        getLineWidth: 10,
        pickable: true,
        onHover: (
          hoverTarget // TODO: Refactor layers to work better with useAutoVariable hook
        ) =>
          layerVariables[`${name}_map_${layer.name}_hover`].update(
            hoverTarget.object
          ),
        onClick: (clickTarget) =>
          layerVariables[`${name}_map_${layer.name}_click`].update(
            clickTarget.object
          ),
      });
    })
    .filter((l) => l);

  const [currentView, updateView] = useAutoVariable(
    //@ts-ignore
    view.var ? view.var : `${name}_map_loc`,
    //@ts-ignore
    view.var ? undefined : "mapLocVar",
    //@ts-ignore
    view.var ? undefined : view
  );
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
      <DeckGL
        width={"100%"}
        height={"100%"}
        initialViewState={{
          latitude: currentView?.lat ? currentView.lat : 0,
          longitude: currentView?.lng ? currentView.lng : 0,
          zoom: currentView?.zoom ? currentView.zoom : 7,
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
    </Box>
  );
};
