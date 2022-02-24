import React, { useContext, useEffect, useMemo } from "react";
import { GeomType } from "../../../Datasets/Dataset";
import { AutoVariableInterface, useAutoVariable } from "Hooks/useAutoVariable";
import {
  ScatterplotLayer,
  PathLayer,
  PolygonLayer,
  BitmapLayer,
} from "@deck.gl/layers";
import {
  convertPoint,
  convertLine,
  expandMultiAndConvertPoly,
  generateColorVar,
  generateNumericVar,
} from "./LayerUtils";
import { useNormalizeSpec } from "../../../Hooks/useNormalizeSpec";
import { useRequestData } from "Hooks/useRequestData";
import { useMaticoSelector } from "Hooks/redux";
import { MVTLayer, TileLayer } from "deck.gl";

interface MaticoLayerInterface {
  name: string;
  source: { name: string; filters?: any };
  style: any;
  onUpdate: (layerState) => void;
  mapName: string;
}

export const MaticoMapLayer: React.FC<MaticoLayerInterface> = ({
  source,
  style,
  name,
  mapName,
  onUpdate,
}) => {
  const dataset = useMaticoSelector(
    (state) => state.datasets.datasets[source.name]
  );

  const [hoverVariable, updateHoverVariable] = useAutoVariable({
    name: `${mapName}_map_${name}_hover`,
    type: "any",
    initialValue: null,
    bind: true,
  } as AutoVariableInterface);

  const [clickVariable, updateClickVariable] = useAutoVariable({
    name: `${mapName}_map_${name}_click`,
    type: "any",
    initialValue: null,
    bind: true,
  } as AutoVariableInterface);

  const [mappedFilters, filtersReady, filterMapError] = useNormalizeSpec(
    source.filters ? source.filters : []
  );
  const [mappedStyle, styleReady, styleMapError] = useNormalizeSpec(style);

  const dataResult = useRequestData(
    filtersReady && dataset.tiled === false ? source.name : null,
    mappedFilters
  );

  const preparedData = useMemo(() => {
    if (!styleReady) {
      return [];
    }
    if (!dataResult) {
      return [];
    }
    if (dataResult.state !== "Done") {
      return [];
    }
    if (dataset && dataset.tiled === true) {
      return [];
    }

    switch (dataset.geomType) {
      case GeomType.Point:
        return dataResult.result.map((d: any) => ({
          ...d,
          geom: convertPoint(d.geom),
        }));
      case GeomType.Polygon:
        return expandMultiAndConvertPoly(dataResult.result);
      case GeomType.Line:
        return dataResult.result.map((d: any) => ({
          ...d,
          geom: convertLine(d.geom),
        }));
    }
  }, [source.name, dataResult, styleReady, dataset]);

  useEffect(() => {
    // if the style isnt ready return
    if (!styleReady || !mappedStyle) {
      return;
    }

    //If we the dataset is tiled and we dont have data
    //return
    if (!dataset.tiled) {
      if (!dataResult || dataResult.state !== "Done") {
        return;
      }
    }

    let layer = undefined;
    const fillColor = generateColorVar(mappedStyle.fillColor, true) ?? [
      255, 0, 0, 100,
    ];
    
    const lineColor = generateColorVar(mappedStyle.lineColor, true) ?? [
      0, 255, 0, 100,
    ];
    const lineWidth = generateNumericVar(mappedStyle.lineWidth) ?? 10;
    const elevation = generateNumericVar(mappedStyle.elevation) ?? 0;

    const shouldExtrude =
      elevation !== null && (elevation > 0 || typeof elevation === "function");
    const shouldStroke =
      lineWidth !== null && (lineWidth > 0 || typeof lineWidth === "function");

    const common = {
      getFillColor: fillColor,
      getLineColor: lineColor,
      getLineWidth: lineWidth,
      extruded: shouldExtrude,
      stroked: shouldStroke,
      getElevation: elevation,
      onHover: (hoverTarget) => updateHoverVariable(hoverTarget.object),
      onClick: (clickTarget) => updateClickVariable(clickTarget.object),
      pickable: true,
      id: name,
      data: dataset.tiled ? dataset.mvtUrl : preparedData,
      updateTriggers: {
        getFillColor: [JSON.stringify(mappedStyle.fillColor)],
        getLineColor: [JSON.stringify(mappedStyle.lineColor)],
        getRadius: [JSON.stringify(mappedStyle.size)],
        getElevation: [JSON.stringify(mappedStyle.elevation)],
        getLineWidth: [JSON.stringify(mappedStyle.lineWidth)],
        extruded: [JSON.stringify(shouldExtrude)],
        stroked: [JSON.stringify(shouldStroke)],
      },
      _legend: {
        name: name,
        domain: mappedStyle?.fillColor?.domain,
        range: mappedStyle?.fillColor?.range,
      },
    };
    if (!dataset.tiled) {
      switch (dataset.geomType) {
        case GeomType.Point:
          layer = new ScatterplotLayer({
            filled: true,
            radiusUnits: mappedStyle.radiusUnits
              ? mappedStyle.radiusUnits
              : "meters",
            getRadius: generateNumericVar(mappedStyle.size) ?? 20,
            //@ts-ignore
            getPosition: (d) => d.geom,
            ...common,
            //@ts-ignore
          });
          break;
        case GeomType.Line:
          layer = new PathLayer({
            getColor: [0, 255, 0, 100],
            getPath: (d) => d.geom,
            ...common,
          });
          break;
        case GeomType.Polygon:
          layer = new PolygonLayer({
            //@ts-ignore
            getPolygon: (d) => d.geom,
            filled: true,
            ...common,
          });
          break;
      }
    } else {
      if (dataset.raster) {
        layer = new TileLayer({
          id: name,
          data: dataset.mvtUrl,
          minZoom: 0,
          maxZoom: 19,
          tileSize: 256,

          renderSubLayers: (props) => {
            const {
              bbox: { west, south, east, north },
            } = props.tile;

            return new BitmapLayer(props, {
              data: null,
              image: props.data,
              bounds: [west, south, east, north],
            });
          },
        });
      } else {
        layer = new MVTLayer({
          ...common,
        });
      }
    }

    console.log("Layer is ",layer, dataset.mvtUrl)

    onUpdate(layer);
  }, [
    name,
    JSON.stringify(mappedStyle),
    dataResult && dataResult.state,
    preparedData,
    styleReady,
  ]);

  return <></>;
};
