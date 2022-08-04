import React, { useMemo } from "react";
import { MaticoPaneInterface } from "../Pane";
import { DatasetState, Filter } from "Datasets/Dataset";
import _ from "lodash";
import { useNormalizeSpec } from "Hooks/useNormalizeSpec";
import { useIsEditable } from "Hooks/useIsEditable";
import { useMaticoSelector } from "Hooks/redux";
import { useRequestData } from "Hooks/useRequestData";
import { useAutoVariable } from "Hooks/useAutoVariable";
import wkx from "wkx";
import { MaticoChart } from "@maticoapp/matico_charts";
import {
  generateColorVar,
  generateNumericVar,
} from "../MaticoMapPane/LayerUtils";
import { View } from "@adobe/react-spectrum";
import {ColorSpecification, DatasetRef, Labels, Layer,MapProjection} from "@maticoapp/matico_types/spec";
import {LoadingSpinner} from "Components/MaticoEditor/EditorComponents/LoadingSpinner/LoadingSpinner";

export interface MaticoStaticMapPaneInterface extends MaticoPaneInterface {
  dataset: DatasetRef;
  layers: Layer,
  projection: MapProjection,
  showGraticule: boolean,
  labels?: Labels;
}

export const MaticoStaticMapPane: React.FC<MaticoStaticMapPaneInterface> =
  ({
    dataset = {},
    layers=[],
    projection,
    showGraticule=false,
    id,
    labels,
  }) => {
    const edit = useIsEditable();

    const foundDataset = useMaticoSelector(
      (state) => state.datasets.datasets[dataset.name]
    );

    const datasetReady =
      foundDataset && foundDataset.state === DatasetState.READY;

    const [mappedLayers, layersReady] = useNormalizeSpec(layers);

    const [mappedFilters, filtersReady, _] = useNormalizeSpec(dataset.filters);

    let firstLayer =  mappedLayers ?  mappedLayers[0] : null 

    const chartData = useRequestData( firstLayer?.source?.name, firstLayer?.source?.filters );

    const Chart = useMemo(() => {
      const data = chartData?.state === "Done" ? chartData.result : [];

      const mappedData = data.map( (d: Record<string,any>) => {
        let { geom, ...properties} = d 
        if(!geom) return null
        let geoJSON = wkx.Geometry.parse(Buffer.from(geom)).toGeoJSON() 
        return { type: "Feature", geometry: geoJSON, properties }
      }).filter(g=>g)


      if (!filtersReady || ! layersReady) return <LoadingSpinner/>;

      const styledLayers = mappedLayers.map((l:Layer)=>{
        console.log("mapped layers ", mappedLayers)
        const fillColor = generateColorVar(l?.style?.fillColor);
        const lineColor = generateColorVar(l?.style?.lineColor);
        const lineWidth= generateNumericVar(l?.style?.lineWidth);
        console.log("line color ", lineColor)
        return {fill : l?.style?.fillColor.rgba, type:"map", strokeColor: l?.style?.lineColor.rgba, strokeWidth: l?.style?.lineWidth}
      })

      return (
        <MaticoChart
          title= "Testing polygon data"
          yExtent= {[0,100]}
          xExtent= {[0,100]}
          proj= {projection}
          gratOn={showGraticule}
          layers= {styledLayers}
          data={ mappedData} 
                />
              );
    }, [
      chartData,
      mappedLayers,
      showGraticule,
      projection
    ]);

    return (
      <View 
        position="relative"
        width="100%"
        height="100%"
      >
        {Chart}
      </View>
    );
  };
