import React, { useContext } from "react";
import { useState, useRef, useMemo } from "react"; import { MaticoDataContext } from "../../../Contexts/MaticoDataContext/MaticoDataContext";
import { MaticoPaneInterface } from "../Pane";
import { Box } from "grommet";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { Filter } from "../../../Datasets/Dataset";
import { useMaticoSelector } from "../../../Hooks/redux";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { EditButton } from "Components/MaticoEditor/Utils/EditButton";
import { useNormalizeSpec } from "../../../Hooks/useNormalizeSpec";
import { MaticoChart } from "@maticoapp/matico_charts";
import { useRequestColumnStat } from "Hooks/useRequestColumnStat";

export interface MaticoHistogramPaneInterface extends MaticoPaneInterface {
  dataset: { name: string; filters: Array<Filter> };
  column: string;
  color?: string;
  maxbins?: number;
  editPath?: string;
  labels?:{[name:string]: string}
}

const backgroundColor = "#fff";

export const MaticoHistogramPane: React.FC<MaticoHistogramPaneInterface> = ({
  dataset,
  column = "",
  color,
  maxbins,
  editPath,
  labels 
}) => {
  const { state: dataState } = useContext(MaticoDataContext);
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

  const edit = useIsEditable();

  const foundDataset = useMaticoSelector(
    (state) => state.datasets.datasets[dataset.name]
  );
  const datasetReady = foundDataset && foundDataset.state === "READY";
  const state = useMaticoSelector((state) => state.variables.autoVariables);
  const [mappedFilters, filtersReady, _] = useNormalizeSpec(dataset.filters);


  const chartData = useRequestColumnStat(
    foundDataset && filtersReady 
      ? {
          datasetName: dataset.name,
          column,
          metric: "Histogram",
          filters: mappedFilters,
          parameters: { noBins: maxbins},
        }
      : null
  );
  console.log("mappedFilters ", mappedFilters, chartData, filtersReady,foundDataset )

  if (!chartData || chartData.state !== "Done") {
    return <Box>loading</Box>;
  }

  const data : Array<{binStart:number, binEnd:number, count:number}>= chartData.result

  const extent = [data[0].binStart - (data[0].binEnd - data[0].binStart), data[data.length-1].binEnd]
  console.log("EXTENT IS ",extent)
  return (
    <Box
      background={backgroundColor}
      elevation={"large"}
      fill={true}
      pad="small"
      style={{ width: "100%", height: "100%" }}
    >
      <Box style={{ position: "absolute", top: "-20px", left: "-20px" }}>
        <EditButton editPath={`${editPath}.Histogram`} editType={"Histogram"} />
      </Box>
      {!datasetReady && <div>{dataset.name} not found!</div>}
      {data && (
        <MaticoChart
          xExtent={extent}
          xCol ="binStart"
          xLabel={labels?.x_label ??  column}
          yLabel={labels?.y_label ??  "counts"}
          yCol="count"
          title={labels?.title}
          subtitle={labels?.sub_title}
          attribution={labels?.attribution}
          data={data}
          xAxis={{
            scaleType:"linear",
            position:"bottom"
          }}
          grid= { {rows:true, columns:false }}
          layers={[
            {
              type: "bar",
              color: color,
              scale:11,
              xAccessor:((d:any)=> d.binEnd),
            },
          ]}
        />
      )}
    </Box>
  );
};
