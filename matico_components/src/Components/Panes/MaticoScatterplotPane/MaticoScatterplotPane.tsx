import React, { useMemo } from "react";
import { MaticoPaneInterface } from "../Pane";
import { DatasetState, Filter } from "Datasets/Dataset";
import _ from "lodash";
import { useNormalizeSpec } from "Hooks/useNormalizeSpec";
import { useIsEditable } from "Hooks/useIsEditable";
import { useMaticoSelector } from "Hooks/redux";
import { useRequestData } from "Hooks/useRequestData";
import { useAutoVariable } from "Hooks/useAutoVariable";
import { MaticoChart } from "@maticoapp/matico_charts";
import {
  generateColorVar,
  generateNumericVar,
} from "../MaticoMapPane/LayerUtils";
import { View } from "@adobe/react-spectrum";
import {ColorSpecification, DatasetRef, Labels} from "@maticoapp/matico_types/spec";

export interface MaticoScatterplotPaneInterface extends MaticoPaneInterface {
  dataset: DatasetRef;
  xColumn: string;
  yColumn: string;
  dotColor?: ColorSpecification;
  // backgroundColor: string;
  dotSize?: number;
  labels?: Labels;
}

export const MaticoScatterplotPane: React.FC<MaticoScatterplotPaneInterface> =
  ({
    dataset = {},
    xColumn = "",
    yColumn = "",
    dotColor ={ hex:"#ff0000"},
    dotSize = 1,
    id,
    labels,
  }) => {
    const edit = useIsEditable();

    const foundDataset = useMaticoSelector(
      (state) => state.datasets.datasets[dataset.name]
    );
    const datasetReady =
      foundDataset && foundDataset.state === DatasetState.READY;

    const [mappedStyle, styleReady] = useNormalizeSpec({
      dotColor,
      dotSize,
    });

    const [mappedFilters, filtersReady, _] = useNormalizeSpec(dataset.filters);

    const chartData = useRequestData(dataset.name, dataset.filters, [xColumn,yColumn]);


    const [
      xFilter,
      updateXFilter,
      //@ts-ignore
    ] = useAutoVariable({
      //@ts-ignore
      name: `${xColumn}_range`,
      //@ts-ignore
      type: "NoSelection",
      initialValue: {
        type: "NoSelection",
      },
      bind: true,
    });
    const [
      yFilter,
      updateYFilter,
      //@ts-ignore
    ] = useAutoVariable({
      //@ts-ignore
      name: `${yColumn}_range`,
      //@ts-ignore
      type: "NoSelection",
      initialValue: {
        type: "NoSelection",
      },
      bind: true,
    });
    
    const Chart = useMemo(() => {
      const data = chartData?.state === "Done" ? chartData.result : [];

      if (!filtersReady) return <h1>Loading</h1>;

      const dotSize = generateNumericVar(mappedStyle?.dotSize);
      const dotColor = generateColorVar(mappedStyle?.dotColor);

      const xVals = data.map((d: Record<string,unknown>)=>d[xColumn])
      const yVals = data.map((d: Record<string,unknown>)=>d[yColumn])

      const xExtent = [
        Math.min(...xVals),
        Math.max(...xVals),
      ]

      const yExtent =[
        Math.min(...yVals),
        Math.max(...yVals)
      ]

      console.log("X Columns is ", xColumn, " y column is ",yColumn, " xExtent ", xExtent, " yExtent ", yExtent)

      return (
        <MaticoChart
          xExtent={xExtent}
          yExtent={yExtent}
          xLabel={labels?.xLabel ?? xColumn}
          yLabel={labels?.yLabel ?? yColumn}
          xCol={xColumn}
          yCol={yColumn}
          title={labels?.title ?? `${xColumn} vs ${yColumn}`}
          subtitle={labels?.subTitle}
          attribution={labels?.attribution}
          data={data}
          xAxis={{
            scaleType: "linear",
            position: "bottom",
          }}
          yAxis={{
            scaleType: "linear",
            position: "left",
          }}
          grid={{ rows: true, columns: false }}
          layers={[
            {
              type: "scatter",
              color: dotColor,
              scale: dotSize,
            },
          ]}
          useBrush={{
            horizontal: true,
            vertical: true,
          }}
          //@ts-ignore
          onBrush={({x0,x1,y0,y1}) => {
            
            updateXFilter(
              x0 === x1
              ? {
                type: "NoSelection",
                variable: xColumn
              } : {
                  type: "SelectionRange",
                  variable: xColumn,
                  min: x0,
                  max: x1,
              });
            updateYFilter(
              y0 === y1 
              ? {
                type: "NoSelection",
                variable: yColumn
              } : {
                  type: "SelectionRange",
                  variable: yColumn,
                  min: y0,
                  max: y1,
              });
          }}
        />
      );
    }, [
      chartData,
      mappedStyle
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
