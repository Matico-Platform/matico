import { parseSync } from "@loaders.gl/core";
import { WKBLoader } from "@loaders.gl/wkt";
import React, { useContext, useEffect, useMemo } from "react";
import { GeomType } from "../../../Datasets/Dataset";
import traverse from 'traverse'
import { MaticoDataContext } from "../../../Contexts/MaticoDataContext/MaticoDataContext";
import {
  AutoVariableInterface,
  useAutoVariable,
} from "../../../Hooks/useAutoVariable";
import wkx from "wkx";
import { ScatterplotLayer, PathLayer, PolygonLayer } from "@deck.gl/layers";
import { convertPoint, convertPoly, convertLine,expandMultiAndConvertPoly } from "./LayerUtils";
import {useVariableSelector} from "../../../Hooks/redux";
import _ from 'lodash'

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
  const { state: dataState } = useContext(MaticoDataContext);

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

  const dataset = dataState.datasets.find((d) => {
    return d.name === source.name;
  });

  const datasetReady = dataset ? dataset.isReady() : false

  const state = useVariableSelector((state)=>state.variables.autoVariables) 

  const mappedFilters = traverse(source.filters).map(function(node){
    if(node && node.var){
      const variableName = node.var.split(".")[0]
      const path = node.var.split(".").slice(1).join(".")
      const variable = state[variableName]
      if(variable=== null || variable===undefined){
        console.warn("failed to find variable", variableName)
        return 
      }
      const value  = _.at(variable.value,path)[0]
      this.update(value)
    }
  })



  const preparedData = useMemo(() => {
    if (!datasetReady) {
      return [];
    }


    const data = dataset.getDataWithGeo(mappedFilters);

    switch (dataset.geometryType()) {
      case GeomType.Point:
        return data.map((d) => ({ ...d, geom: convertPoint(d.geom) }));
      case GeomType.Polygon:
        return expandMultiAndConvertPoly(data);
      case GeomType.Line:
        return data.map((d) => ({ ...d, geom: convertLine(d.geom) }));
    }
  }, [source.name, datasetReady, JSON.stringify(mappedFilters)]);


  useEffect(() => {
    if(!dataset || !dataset.isReady()){
      return
    }
    let layer = undefined;
    const common = {
      onHover: (hoverTarget) => updateHoverVariable(hoverTarget.object),
      onClick: (clickTarget) => updateClickVariable(clickTarget.object),
      pickable: true,
      id: name,
      data: preparedData,
    };


    switch (dataset.geometryType()) {
      case GeomType.Point:
        layer = new ScatterplotLayer({
          filled: true,
          getFillColor: style.color
            ? style.color
            : [255, 0, 0, 100],
          radiusUnits: "pixels",
          getRadius: style.size ? style.size : 20,
          getLineColor: [0, 255, 0, 100],
          stroked: true,
          getLineWidth: 10,
          //@ts-ignore
          getPosition: (d) => d.geom,
          ...common,
          //@ts-ignore
        });
        break
      case GeomType.Line:
        layer = new PathLayer({
          getColor: [0, 255, 0, 100],
          getPath: (d) => d.geom,
          ...common,
        });
        break
      case GeomType.Polygon:
        layer = new PolygonLayer({
          //@ts-ignore
          getPolygon: (d) => d.geom,
          filled: true,
          getFillColor: style.color ? style.color : [255, 0, 0, 100],
          getLineColor: [255, 255, 255, 100],
          stroked: true,
          getLineWidth: 1,
          lineWidthMinPixels: 1,
          ...common,
        });
        break
    }

    onUpdate(layer); 
  }, [
    name,
    JSON.stringify(style),
    datasetReady,
    preparedData
  ]);

  return <></>;
};