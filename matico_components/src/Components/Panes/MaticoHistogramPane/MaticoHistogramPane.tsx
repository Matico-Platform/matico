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
import {useIsEditable} from "../../../Hooks/useIsEditable";
import {EditButton} from "../../MaticoEditor/EditButton";

import {
  updateFilterExtent,
  updateActiveDataset,
} from "../../../Utils/chartUtils";
import { useSubVariables } from "../../../Hooks/useSubVariables";

interface MaticoHistogramPaneInterface extends MaticoPaneInterface {
  dataset: { name: string; filters: Array<Filter> };
  column: string;
  color?: string;
  maxbins?: number;
  editPath?:string;
}

const backgroundColor = "#fff";

export const MaticoHistogramPane: React.FC<MaticoHistogramPaneInterface> = ({
  dataset,
  column = "",
  color,
  maxbins,
  editPath
}) => {
  const { state: dataState } = useContext(MaticoDataContext);
  const [view, setView] = useState({});
  const chartRef = useRef();
  const containerRef = useRef();

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
  
  const edit = useIsEditable()
  const foundDataset = dataState.datasets.find((d) => {
    console.log("getting data ");
    return d.name === dataset.name;
  });

  const datasetReady = foundDataset && foundDataset.isReady();

  const dims = useSize(containerRef, datasetReady);
  const padding = {
    top: 25,
    left: 40,
    bottom: 40,
    right: 10,
  };

  const state = useMaticoSelector((state) => state.variables.autoVariables);

  const [mappedFilters, filtersReady,_] = useSubVariables(dataset.filters);

  // @ts-ignore
  const chartData = useMemo(() => {
    return (datasetReady && filtersReady) ? foundDataset.getData(mappedFilters) : [];
  }, [JSON.stringify(mappedFilters), datasetReady, filtersReady]);

  const spec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: dims.width - padding.left - padding.right,
    height: dims.height - padding.top - padding.bottom,
    padding: padding,
    autosize: "none",
    config: {
      axis: {
        domain: false,
        tickSize: 3,
        tickColor: "#888",
        labelFont: "Monaco, Courier New",
      },
    },
    title: `Distribution of ${column}`,
    signals: [
      { name: "binOffset", value: 1 }
    ],

    data: [
      {
        name: "table",
        transform: [{ type: "extent", field: column, signal: "xext" }],
      },
      {
        name: "binned",
        source: "table",
        transform: [
          {
            type: "bin",
            field: column,
            extent: { signal: "xext" },
            anchor: { signal: "binOffset" },
            maxbins: maxbins,
            nice: false,
          },
          {
            type: "aggregate",
            key: "bin0",
            groupby: ["bin0", "bin1"],
            fields: ["bin0"],
            ops: ["count"],
            as: ["count"],
          },
        ],
      },
    ],
    scales: [
      {
        name: "xscale",
        type: "linear",
        range: "width",
        domain: { signal: "xext" },
      },
      {
        name: "yscale",
        type: "linear",
        range: "height",
        round: true,
        domain: { data: "binned", field: "count" },
        zero: true,
        nice: true,
      },
    ],

    axes: [
      { orient: "bottom", scale: "xscale", zindex: 1 },
      { orient: "left", scale: "yscale", tickCount: 5, zindex: 1 },
    ],

    marks: [
      {
        type: "rect",
        from: { data: "binned" },
        encode: {
          update: {
            x: { scale: "xscale", field: "bin0" },
            x2: {
              scale: "xscale",
              field: "bin1"
            },
            y: { scale: "yscale", field: "count" },
            y2: { scale: "yscale", value: 0 },
            fill: { value: color },
          },
          hover: { fill: { value: "firebrick" } },
        },
      },
      {
        type: "rect",
        from: { data: "table" },
        encode: {
          enter: {
            x: { scale: "xscale", field: column },
            width: { value: 1 },
            y: {
              value: 25,
              offset: { value: dims.height - padding.bottom - padding.top },
            },
            height: { value: 5 },
            fill: { value: color },
            fillOpacity: { value: 0.4 },
          },
        },
      },
    ],
  };

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
      <Box style={{position:"absolute", top:"-20px", left:"-20px"}} >
        <EditButton editPath={`${editPath}.Histogram`} editType={"Histogram"} /> 
      </Box>
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
