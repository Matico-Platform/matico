import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { Box, Button } from "grommet";
import { DatasetState, Filter } from "Datasets/Dataset";
import _ from "lodash";
import {useNormalizeSpec} from 'Hooks/useNormalizeSpec'
import {useIsEditable} from "Hooks/useIsEditable";
import { EditButton } from "Components/MaticoEditor/Utils/EditButton";
import {useMaticoSelector} from "Hooks/redux";
import {useRequestData} from "Hooks/useRequestData";
import {MaticoChart} from "@maticoapp/matico_charts"
import {generateColorVar, generateNumericVar} from "../MaticoMapPane/LayerUtils";


export interface MaticoScatterplotPaneInterface extends MaticoPaneInterface {
  dataset: { name: string; filters: Array<Filter> };
  x_column: string;
  y_column: string;
  dot_color?: string;
  // backgroundColor: string;
  dot_size?: number;
  editPath?:string;
  labels?:{[label:string] : string};
}

export const MaticoScatterplotPane: React.FC<MaticoScatterplotPaneInterface> =
  ({
    dataset = {},
    x_column = "",
    y_column = "",
    dot_color = "#ff0000",
    dot_size = 1,
    editPath,
    labels
  }) => {

    const edit = useIsEditable()

    const foundDataset = useMaticoSelector( state => state.datasets.datasets[dataset.name])
    const datasetReady = foundDataset && foundDataset.state===DatasetState.READY;

    const [mappedStyle, styleReady,] = useNormalizeSpec({
      dot_color,
      dot_size
    })

    const dotSize = generateNumericVar(mappedStyle?.dot_size);
    const dotColor = generateColorVar(mappedStyle?.dot_color);

    const [mappedFilters, filtersReady, _] = useNormalizeSpec(dataset.filters)
    const chartData = useRequestData(dataset.name, dataset.filters)

    const data = chartData?.state==="Done" ? chartData.result : []
    
    if(!filtersReady) return <h1>Loading</h1>

      const [xExtent, yExtent] = data.reduce((agg,val)=>{
        agg[0][0] = Math.min(agg[0][0], val[x_column])
        agg[0][1] = Math.max(agg[0][1], val[x_column])
        agg[1][0] = Math.min(agg[1][0], val[y_column])
        agg[1][1] = Math.max(agg[1][1], val[y_column])
        return agg
      },[ [ Number.MAX_VALUE, Number.MIN_VALUE], [Number.MAX_VALUE,Number.MIN_VALUE]])


    return (
      <Box
        elevation={"large"}
        fill={true}
        pad="small"
      >
        <Box style={{position:"absolute", top:"-20px", left:"-20px"}} >
          <EditButton editPath={`${editPath}.Scatterplot`} editType={"Scatterplot"} /> 
        </Box>
        {!datasetReady && <div>{dataset.name} not found!</div>} 
        {(data &&
          <MaticoChart
            xExtent={xExtent}
            yExtent={yExtent}
            xLabel={labels?.x_label ??  x_column}
            yLabel={labels?.y_label ??  y_column}
            xCol ={x_column}
            yCol={y_column}
            title={labels?.title ?? `${x_column} vs ${y_column}`}
            subtitle={labels?.sub_title}
            attribution={labels?.attribution}
            data={data}
            xAxis={{
              scaleType:"linear",
              position:"bottom"
            }}
            yAxis={{
              scaleType:"linear",
              position:"left"
            }}
            grid= { {rows:true, columns:false }}
            layers={[
              {
                type: "scatter",
                color: dotColor,
                scale: dotSize 
              },
            ]}
          />
        )}
      </Box>
    );
};
