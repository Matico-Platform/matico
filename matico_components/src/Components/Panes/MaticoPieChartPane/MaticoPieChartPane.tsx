import React, { useContext } from "react";
import { Vega } from "react-vega";
import { useState, useRef, useMemo } from "react";
import { MaticoDataContext } from "../../../Contexts/MaticoDataContext/MaticoDataContext";
import { MaticoPaneInterface } from "../Pane";
import { Box } from "grommet";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { Filter } from "../../../Datasets/Dataset";
import { useMaticoSelector } from "../../../Hooks/redux";
import { useSize } from "../../../Hooks/useSize";
import {
  updateFilterExtent,
  updateActiveDataset,
} from "../../../Utils/chartUtils";
import { useSubVariables } from "../../../Hooks/useSubVariables";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { EditButton } from "../../MaticoEditor/EditButton";

interface MaticoPieChartPaneInterface extends MaticoPaneInterface {
  dataset: { name: string; filters: Array<Filter> };
  column: string;
  theme?: string;
  editPath?: string;
}

const backgroundColor = "#fff";

const parsePieChartData = (data: any, column: string) => {
  const valueSum = Object.values(data).reduce((a: number, b: number) => a + b) as number;
  const startAngle = 0;
  const endAngle = 6.29;
  const k = (endAngle - startAngle) / valueSum
  let a: number = 0;
  //@ts-ignore type for array string number
  const sortedData = Object.entries(data).sort((a,b) => a[1] - b[1]).map(entry => {
    const startAngle = a+0;
    //@ts-ignore type for array string number
    a+= k * entry[1]
    const endAngle = a+0;
    return { [column]: entry[0], count: entry[1], tooltip: `${entry[0]}: ${entry[1]}`, startAngle, endAngle }
  })

  return sortedData
}
export const MaticoPieChartPane: React.FC<MaticoPieChartPaneInterface> = ({
  dataset,
  column = "",
  theme,
  editPath,
}) => {
  const { state: dataState } = useContext(MaticoDataContext);
  const [view, setView] = useState({});
  const chartRef = useRef();
  const containerRef = useRef();
  const edit = useIsEditable();

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

  const foundDataset = dataState.datasets.find((d) => {
    return d.name === dataset.name;
  });

  const datasetReady = foundDataset && foundDataset.isReady();

  const dims = useSize(containerRef, datasetReady);
  const padding = {
    top: 25,
    left: 40,
    bottom: 10,
    right: 10,
  };

  const state = useMaticoSelector((state) => state.variables.autoVariables);

  const [mappedFilters, filtersReady, _] = useSubVariables(dataset.filters);

  const squareDim = Math.min(
    dims.width - padding.left - padding.right,
    dims.height - padding.top - padding.bottom
  )
  const spec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    padding: padding,
    width: squareDim,
    height: squareDim,
    autosize: "none",
    title: `Share of ${column} Categories`,
    data: [
      {
        name: "table"
      },
    ],
    scales: [
      {
        name: "color",
        type: "ordinal",
        domain: {
          data: "table",
          field: column,
        },
        range: {
          scheme: "category20c",
        },
      },
    ],

    marks: [
      {
        type: "arc",
        from: {
          data: "table",
        },
        encode: {
          enter: {
            fill: {
              scale: "color",
              field: column,
            },
            x: {
              signal: squareDim/2
            },
            y: {
              signal:squareDim/2
            },
            startAngle: {
              field: "startAngle",
            },
            endAngle: {
              field: "endAngle",
            },
            outerRadius: {
              signal: squareDim/2
            },
            tooltip: { field: "tooltip" },
          },
        },
      },
    ],
  };
  // @ts-ignore
  const chartData = useMemo(() => {
    return datasetReady && filtersReady && column
      ? parsePieChartData(foundDataset.getCategoryCounts(column), column)
      : [];
  }, [JSON.stringify(mappedFilters), datasetReady, filtersReady, column]);

  // function handleDragEnd(e, result) {
  //   if (isNaN(result[1][0]) || isNaN(result[1][1])) return;

  //   updateXFilter({
  //     type: "SelectionRange",
  //     variable: x_column,
  //     min: Math.min(result[0][0], result[1][0]),
  //     max: Math.max(result[0][0], result[1][0]),
  //   });
  //   updateYFilter({
  //     type: "SelectionRange",
  //     variable: y_column,
  //     min: Math.min(result[0][1], result[1][1]),
  //     max: Math.max(result[0][1], result[1][1]),
  //   });
  // }

  const signalListeners = {
    // xext: (e,v) => console.log(v)
    // click: handleClick,
    // tempDrag: (e, target) => console.log(e, target)
  };

  // useEffect(() => {
  //   if (xFilter && yFilter && view && Object.keys(view).length) {
  //     if (xFilter.min && yFilter.min) {
  //       updateFilterExtent({
  //         view,
  //         xFilter,
  //         yFilter,
  //         dataset: "filterExtent",
  //       });
  //     }
  //     if (chartData.length) {
  //       updateActiveDataset({
  //         view,
  //         chartData,
  //         filter: (data) =>
  //           data[x_column] >= xFilter.min &&
  //           data[x_column] <= xFilter.max &&
  //           data[y_column] >= yFilter.min &&
  //           data[y_column] <= yFilter.max,
  //         dataset: "active",
  //       });
  //     }
  //   }
  // }, [view, JSON.stringify(xFilter), JSON.stringify(yFilter)]);

  if (!datasetReady) {
    return <div>{dataset.name} not found!</div>;
  }
  
  return (
    <Box
      background={backgroundColor}
      elevation={"large"}
      fill={true}
      ref={containerRef}
      pad="small"
    >
      {edit && (
        <Box style={{ position: "absolute", left: "-20px", top: "-20px" }}>
          <EditButton editPath={`${editPath}.PieChart`} editType={"PieChart"} /> 
        </Box>
      )}
      <Vega
        ref={chartRef}
        data={{ table: chartData }}
        signalListeners={signalListeners}
        onNewView={(view) => setView(view)}
        // @ts-ignore
        spec={spec}
      />
    </Box>
  );
};
