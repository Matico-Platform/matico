import React, { useMemo } from "react";
import { MaticoPaneInterface } from "../Pane";
import { DatasetState, Filter } from "Datasets/Dataset";
import _ from "lodash";
import { useNormalizeSpec } from "Hooks/useNormalizeSpec";
import { useIsEditable } from "Hooks/useIsEditable";
import { EditButton } from "Components/MaticoEditor/Utils/EditButton";
import { useMaticoSelector } from "Hooks/redux";
import { useRequestData } from "Hooks/useRequestData";
import { useAutoVariable } from "Hooks/useAutoVariable";
import { MaticoChart } from "@maticoapp/matico_charts";
import {
  generateColorVar,
  generateNumericVar,
} from "../MaticoMapPane/LayerUtils";
import { View } from "@adobe/react-spectrum";

export interface MaticoScatterplotPaneInterface extends MaticoPaneInterface {
  dataset: { name: string; filters: Array<Filter> };
  x_column: string;
  y_column: string;
  dot_color?: string;
  // backgroundColor: string;
  dot_size?: number;
  editPath?: string;
  labels?: { [label: string]: string };
}

export const MaticoScatterplotPane: React.FC<MaticoScatterplotPaneInterface> =
  ({
    dataset = {},
    x_column = "",
    y_column = "",
    dot_color = "#ff0000",
    dot_size = 1,
    editPath,
    labels,
  }) => {
    const edit = useIsEditable();

    const foundDataset = useMaticoSelector(
      (state) => state.datasets.datasets[dataset.name]
    );
    const datasetReady =
      foundDataset && foundDataset.state === DatasetState.READY;

    const [mappedStyle, styleReady] = useNormalizeSpec({
      dot_color,
      dot_size,
    });

    const [mappedFilters, filtersReady, _] = useNormalizeSpec(dataset.filters);
    const chartData = useRequestData(dataset.name, dataset.filters);

    const [
      xFilter,
      updateXFilter,
      //@ts-ignore
    ] = useAutoVariable({
      //@ts-ignore
      name: `${x_column}_range`,
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
      name: `${y_column}_range`,
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

      const dotSize = generateNumericVar(mappedStyle?.dot_size);
      const dotColor = generateColorVar(mappedStyle?.dot_color);

      const [xExtent, yExtent] = data.reduce(
        (agg, val) => {
          agg[0][0] = Math.min(agg[0][0], val[x_column]);
          agg[0][1] = Math.max(agg[0][1], val[x_column]);
          agg[1][0] = Math.min(agg[1][0], val[y_column]);
          agg[1][1] = Math.max(agg[1][1], val[y_column]);
          return agg;
        },
        [
          [Number.MAX_VALUE, Number.MIN_VALUE],
          [Number.MAX_VALUE, Number.MIN_VALUE],
        ]
      );

      return (
        <MaticoChart
          xExtent={xExtent}
          yExtent={yExtent}
          xLabel={labels?.x_label ?? x_column}
          yLabel={labels?.y_label ?? y_column}
          xCol={x_column}
          yCol={y_column}
          title={labels?.title ?? `${x_column} vs ${y_column}`}
          subtitle={labels?.sub_title}
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
                variable: x_column
              } : {
                  type: "SelectionRange",
                  variable: x_column,
                  min: x0,
                  max: x1,
              });
            updateYFilter(
              y0 === y1 
              ? {
                type: "NoSelection",
                variable: y_column
              } : {
                  type: "SelectionRange",
                  variable: y_column,
                  min: y0,
                  max: y1,
              });
          }}
        />
      );
    }, [
      JSON.stringify({ labels, x_column, y_column, mappedStyle }),
      chartData,
    ]);

    return (
      <View 
        position="relative"
      >
        <View 
          position="absolute"
          left="-20px"
          top="-20px"
          >
          <EditButton
            editPath={`${editPath}.Scatterplot`}
            editType={"Scatterplot"}
          />
        </View>
        {Chart}
      </View>
    );
  };
