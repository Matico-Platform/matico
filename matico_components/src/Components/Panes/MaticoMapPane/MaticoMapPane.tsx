import React, { useEffect, useContext } from "react";
import { MapPane, View } from "matico_spec";
import type { MaticoPaneInterface } from "../Pane";
import { GeomType } from "../../../Datasets/Dataset";
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
import { PolygonLayer, PathLayer, ScatterplotLayer } from "@deck.gl/layers";
import { WKBLoader } from "@loaders.gl/wkt";
import { parseSync } from "@loaders.gl/core";
import wkx from "wkx";
import {
  useAutoVariable,
  useAutoVariables,
  AutoVariableInterface,
} from "../../../Hooks/useAutoVariable";
interface MaicoMapPaneInterface extends MaticoPaneInterface {
  view: View;
  //TODO WE should properly type this from the matico_spec library. Need to figure out the Typescript integration better or witx
  base_map?: any;
  layers?: Array<any>;
}

function chunkCoords(coords: Array<Number>) {
  return coords.reduce((result, coord, index) => {
    const i = Math.floor(index / 2);
    const j = index % 2;
    result[i] = result[i] ? result[i] : [];
    result[i][j] = coord;
    return result;
  }, []);
}

function mapCoords(array: Array<{ x: number; y: number }>) {
  return array.map((a) => [a.x, a.y]);
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

  const hoverVarConfig = layers.map(
    (layer) =>
      ({
        name: `${name}_map_${layer.name}_hover`,
        type: "any",
        initialValue: null,
        bind: true,
      } as AutoVariableInterface)
  );

  const clickVarConfig = layers.map(
    (layer) =>
      ({
        name: `${name}_map_${layer.name}_click`,
        type: "any",
        initialValue: null,
        bind: true,
      } as AutoVariableInterface)
  );

  const autoVarConfig = [...hoverVarConfig, ...clickVarConfig];

  const layerVariables = useAutoVariables(autoVarConfig);

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

  const mapLayers = layers
    .sort((a, b) => a.order - b.order)
    .map((layer) => {
      const dataset = dataState.datasets.find((d) => {
        return d.name === layer.source.name;
      });

      if (!dataset || !dataset.isReady()) {
        return;
      }

      switch (dataset.geometryType()) {
        case GeomType.Point:
          return new ScatterplotLayer({
            id: layer.name,
            data: dataset.getDataWithGeo(layer.source.filters),
            filled: true,
            getFillColor: layer.style.color
              ? layer.style.color
              : [255, 0, 0, 100],
            radiusUnits: "pixels",
            getRadius: layer.style.size ? layer.style.size : 20,
            getLineColor: [0, 255, 0, 100],
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
            //@ts-ignore
            getPosition: (d) => parseSync(d.geom, WKBLoader).positions.value,
          });
        case GeomType.Polygon:
          const data = dataset.getDataWithGeo(layer.source.filters);
          return new PolygonLayer({
            id: layer.name,
            data,
            filled: true,
            getFillColor: layer.style.color
              ? layer.style.color
              : [255, 0, 0, 100],
            getLineColor: [0, 255, 0, 100],
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
            //@ts-ignore
              getPolygon: (d) =>{  
                //@ts-ignore
                const geom = wkx.Geometry.parse(Buffer.from(d.geom)) 
                console.log(geom)
                //@ts-ignore
                return [ mapCoords(geom.polygons[0].exteriorRing),
                //@ts-ignore
                  ...geom.polygons[0].interiorRings.map(mapCoords)
                ]
              } 
          });

        case GeomType.Line:
          return new PathLayer({
            id: layer.name,
            data: dataset.getDataWithGeo(layer.source.filters),
            getColor: [0, 255, 0, 100],
            getWidth: 100,
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
            //@ts-ignore
            getPath: (d) =>
              //@ts-ignore
              chunkCoords(parseSync(d.geom, WKBLoader).positions.value),
          });
      }
    })
    .filter((l) => l);

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
      )}
    </Box>
  );
};
