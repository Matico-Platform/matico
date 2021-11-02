import React from "react";
import { Vega, View } from "react-vega";
import * as vega from "vega";
import { useState, useEffect, useRef, useMemo } from "react";
import { Column, Dataset } from "../../../Datasets/Dataset";
import { MaticoPaneInterface } from "../Pane";
import _ from "lodash";

// const Chart: React.FC<{
//   spec: any;
//   data: any;
//   signalListeners: any;
//   setView: (v: View) => void;
// }> = ({ spec, data, signalListeners, setView }) => (
// );

interface MaticoHistogramPaneInterface extends MaticoPaneInterface {
  datasource: Dataset;
  column: Column;
}

export const MaticoHistogramPane: React.FC<MaticoHistogramPaneInterface> = ({
  datasource,
  column,
}) => {
  const [view, setView] = useState<View | null>(null);
  // const chartRef = useRef();

  const chartData = _.range(200).map((a) => ({ id: a, value: Math.random() }));
  console.log("chart Data is ", chartData);
  const histogramData = {
    table: chartData,
  };

  useEffect(() => {
    if (!view ) return;
    function updateGraph() {
      const cs = vega
        .changeset()
        .remove(() => true)
        .insert(chartData);
      view.change("active", cs).run();
    }
    Object.keys(view).length && updateGraph();
  }, [view]);

  // useEffect(() => {
  //     function updateExtent() {
  //         const cs = vega
  //             .changeset()
  //             .remove(() => true)
  //             .insert(currFilters.length
  //                 ? {'bin0':currFilters[0].from, 'bin1':currFilters[0].to}
  //                 : {}
  //             );
  //         view.change('filterExtent', cs).run();
  //     }
  //     Object.keys(view).length && updateExtent();
  // }, [view, currFilters]);

  const spec = {
    width: 300,
    height: 150,
    padding: 5,
    data: [
      {
        name: "table",
        transform: [{ type: "extent", field: "value", signal: "ext" }],
      },
      {
        name: "active",
      },
      {
        name: "filterExtent",
      },
      {
        name: "binned",
        source: "table",
        transform: [
          {
            type: "bin",
            field: "value",
            extent: { signal: "ext" },
            maxbins: 40,
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
          { type: "extent", field: "count", signal: "max" },
        ],
      },
      {
        name: "activeBinned",
        source: "active",
        transform: [
          {
            type: "bin",
            field: "value",
            extent: { signal: "ext" },
            maxbins: 40,
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
    signals: [
      {
        name: "click",
        on: [{ events: "*:click", encode: "click" }],
      },
      {
        name: "startDrag",
        value: null,
        on: [
          { events: "mouseup, touchend", update: "0" },
          { events: "mousedown, touchstart", update: "1" },
        ],
      },
      {
        name: "startDragCoords",
        value: null,
        on: [
          {
            events: "mousedown, touchstart",
            update: "[datum.bin0,datum.bin1]",
          },
        ],
      },
      {
        name: "dragBox",
        value: null,
        on: [
          {
            events: { signal: "startDragCoords" },
            force: true,
            update: "startDragCoords",
          },
          {
            events: "mousemove, touchmove",
            update:
              "startDrag ? [min(datum.bin0,dragBox[0]),max(datum.bin1,dragBox[1])] : dragBox",
          },
        ],
      },
      {
        name: "endDrag",
        value: null,
        on: [{ events: "mouseup, touchend", update: "dragBox" }],
      },
    ],
    scales: [
      {
        name: "xscale",
        type: "linear",
        range: "width",
        domain: { signal: "ext" },
        padding: 0,
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
      {
        name: "yscaleActive",
        type: "linear",
        range: "height",
        round: true,
        domain: { data: "activeBinned", field: "count" },
        zero: true,
        nice: true,
      },
    ],

    //     "axes": [
    //         {
    //             "scale": "xscale",
    //             "orient": "top",
    //             "offset": {"signal": "xoffset+10"},
    //             "labelOverlap": false,
    //             "grid":true,
    //             "format": ".2s",
    //             "title":props.config.xVariable,
    //             "tickCount":5,
    //             "tickColor":"#fff",
    //             "titleY":10
    //         },
    //         {
    //             "scale": "yscale",
    //             "orient": "right",
    //             "offset": {"signal": "yoffset+10"},
    //             "title":props.config.yVariable,
    //             "labelOverlap": false,
    //             "grid":true,
    //             "format": ".2s",
    //             "tickCount":3,
    //             "tickColor":"#fff",
    //             "titleX":-10
    //         }
    // ],
    axes: [
      {
        orient: "bottom",
        scale: "xscale",
        zindex: 1,
        title: column.name,
      },
      {
        orient: "left",
        scale: "yscale",
        tickCount: 5,
        zindex: 1,
        title: "Count of Geographies",
      },
    ],

    marks: [
      {
        type: "rect",
        from: { data: "binned" },
        clip: true,
        encode: {
          update: {
            x: { scale: "xscale", field: "bin0" },
            x2: { scale: "xscale", field: "bin1" },
            y: { scale: "yscale", signal: "max[1]" },
            y2: { scale: "yscale", value: 0 },
            fill: { value: "#00000000" },
          },
          hover: { fill: { value: "#00000055" } },
        },
      },
      {
        type: "rect",
        interactive: false,
        from: { data: "binned" },
        encode: {
          update: {
            x: { scale: "xscale", field: "bin0", offset: 1 },
            x2: { scale: "xscale", field: "bin1", offset: -1 },
            y: { scale: "yscale", field: "count" },
            y2: { scale: "yscale", value: 0 },
            fill: { value: "steelblue" },
          },
        },
      },
      {
        type: "rect",
        interactive: false,
        from: { data: "activeBinned" },
        encode: {
          update: {
            x: { scale: "xscale", field: "bin0", offset: 4 },
            x2: { scale: "xscale", field: "bin1", offset: -4 },
            y: { scale: "yscaleActive", field: "count" },
            y2: { scale: "yscaleActive", value: 0 },
            fill: { value: "black" },
          },
        },
      },
      {
        type: "rect",
        interactive: false,
        encode: {
          update: {
            x: { scale: "xscale", signal: "startDrag ? dragBox[0] : 0" },
            x2: { scale: "xscale", signal: "startDrag ? dragBox[1] : 0" },
            y: { scale: "yscale", signal: "max[1]" },
            y2: { scale: "yscale", value: 0 },
            fill: { value: "#ffff0077" },
          },
        },
      },
      {
        type: "rect",
        interactive: false,
        from: { data: "filterExtent" },
        encode: {
          update: {
            x: { scale: "xscale", field: "bin0" },
            x2: { scale: "xscale", field: "bin1" },
            y: { scale: "yscale", signal: "max[1]" },
            y2: { scale: "yscale", value: 0 },
            fill: { value: "#ffff0077" },
          },
        },
      },
      {
        type: "rect",
        interactive: false,
        from: { data: "activeBinned" },
        encode: {
          update: {
            x: { scale: "xscale", field: "bin0", offset: 4 },
            x2: { scale: "xscale", field: "bin1", offset: -4 },
            y: { scale: "yscaleActive", field: "count" },
            y2: { scale: "yscaleActive", value: 0 },
            fill: { value: "black" },
          },
        },
      },
    ],
  };
  // const handleDrag = (e,target) => {
  //     dispatch({
  //         type: "SET_MAP_FILTER",
  //         payload: {
  //             widgetIndex: props.config.id,
  //             filterId: `${props.config.id}`,
  //             filter: {
  //             type: "range",
  //             field: props.config.variable,
  //             from: target[0],
  //             to: target[1]
  //             }
  //         }
  //     });
  // }
  const signalListeners = {};
  // const signalListeners = {
  //     endDrag: handleDrag
  // };

  // const VegaChart = useMemo(() =>     , [chartData.length])

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        backgroundColor: "red",
        position: "relative",
      }}
    >
      {chartData.length && (
  <Vega
  //@ts-ignore
    spec={spec}
    data={chartData}
    signalListeners={signalListeners}
    onNewView={(view: View) => setView(view)}
  />
      )}
    </div>
  );
};
