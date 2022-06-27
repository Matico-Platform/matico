import React  from "react";
import { useState, useMemo } from "react";
import { MaticoPaneInterface } from "../Pane";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { Filter } from "../../../Datasets/Dataset";
import { useMaticoSelector } from "../../../Hooks/redux";
import { useNormalizeSpec } from "../../../Hooks/useNormalizeSpec";
import { MaticoChart } from "@maticoapp/matico_charts";
import { useRequestColumnStat } from "Hooks/useRequestColumnStat";
import { generateColorVar } from "../MaticoMapPane/LayerUtils";
import { View } from "@adobe/react-spectrum";

export interface MaticoHistogramPaneInterface extends MaticoPaneInterface {
  dataset: { name: string; filters: Array<Filter> };
  column: string;
  color?: string;
  maxbins?: number;
  labels?: { [name: string]: string };
}

const backgroundColor = "#fff";

export const MaticoHistogramPane: React.FC<MaticoHistogramPaneInterface> = ({
  dataset,
  column = "",
  color,
  maxbins,
  labels,
  id
}) => {
  const [view, setView] = useState({});

  const [
    columnFilter,
    updateFilter,
    //@ts-ignore
  ] = useAutoVariable({
    //@ts-ignore
    name: `${column}_range`,
    //@ts-ignore
    type: "NoSelection",
    initialValue: {
      type: "NoSelection",
    },
    bind: true,
  });


  const foundDataset = useMaticoSelector(
    (state) => state.datasets.datasets[dataset.name]
  );
  const datasetReady = foundDataset && foundDataset.state === "READY";
  const [mappedFilters, filtersReady] = useNormalizeSpec(dataset.filters);

  const [mappedStyle, styleReady] = useNormalizeSpec({
    color,
  });

  console.log("Histogram color is ", color, mappedStyle)

  const dataRequest =
    foundDataset && filtersReady
      ? {
          datasetName: dataset.name,
          column,
          metric: "histogram",
          filters: mappedFilters,
          parameters: { bins: maxbins },
        }
      : null;

  console.log("data request ", dataRequest);

  const chartData = useRequestColumnStat(dataRequest);
  
  console.log("Chart data ", chartData)

  const Chart = useMemo(() => {
    if (!chartData || chartData.state !== "Done") {
      return <View>loading</View>;
    }
    const data: Array<{ binStart: number; binEnd: number; count: number }> =
      chartData.result;

    const extent = [
      data[0].binStart - (data[0].binEnd - data[0].binStart),
      data[data.length - 1].binEnd,
    ];

    const colorMap = generateColorVar(mappedStyle?.color);

    return (
        <MaticoChart
          xExtent={extent}
          xCol="binStart"
          xLabel={labels?.x_label ?? column}
          yLabel={labels?.y_label ?? "counts"}
          yCol="count"
          title={labels?.title}
          subtitle={labels?.sub_title}
          attribution={labels?.attribution}
          data={data.filter((d) => d.count)}
          xAxis={{
            scaleType: "linear",
            position: "bottom",
          }}
          grid={{ rows: true, columns: false }}
          useBrush={{
            vertical: false,
            horizontal: true,
          }}
          //@ts-ignore
          onBrush={({ x0, x1 }) =>
            updateFilter(
              x0 === x1
                ? {
                    type: "NoSelection",
                    variable: column,
                  }
                : {
                    type: "SelectionRange",
                    variable: column,
                    min: x0,
                    max: x1,
                  }
            )
          }
          layers={[
            {
              type: "bar",
              color: colorMap,
              scale: 11,
              xAccessor: (d: any) => d.binEnd,
            },
          ]}
        />
    );
  }, [JSON.stringify({ labels, mappedStyle, backgroundColor }), chartData]);

  return (
    <View width="100%" height="100%" position="relative">
      {!datasetReady && <div>{dataset.name} not found!</div>}
      {Chart}
    </View>
  );
};
