import React from "react";
import { Story, Meta } from "@storybook/react";

import MaticoChart from "../components/MaticoChart";
import { ChartSpaceSpec } from "../components/types";

import {
  SampleMapData,
  SampleMapData2,
  SampleMapData3,
  SampleMapData4,
  SampleMapData5,
  SampleMapData6,
  SampleCategoricalData,
  SampleHistogramData,
  Sample2dData,
  SampleLineChartData,
} from "./SampleData";

import { PieChartColors } from "./SampleStyling";

import * as scale from '@visx/scale';
import { nicelyFormatNumber } from "../Utils";

export default {
  title: "Matico/Charts",
  component: MaticoChart,
  argTypes: {
    onClick: { action: "clicked" },
  },
} as Meta<typeof MaticoChart>;

const Template: Story<ChartSpaceSpec> = (args) => (
  <div
    style={{
      width: "100%",
      height: "600px",
    }}
  >
    <MaticoChart {...args} />
  </div>
);


export const LineChart = Template.bind({});
LineChart.args = {
  layers: [
    {
      type: "scatter",
      radius: 2
      // yCol: 'x_column'
      // lineColor: "steelblue",
      // lineWidth: 0.25,
    },
  ],
  xCol: "x_column",
//   xAxis: {
//     scaleType: "linear",
//     display: true,
//     position: "bottom",
//     tickFormatFunc: (d) => {
//       const date = new Date(d)
//       const month = date.getMonth() + 1
//       const day = date.getDate()
//       const year = date.getFullYear().toString().slice(-2)
//       return `${month}/${day}/${year}`
//     },
//   },
//   xLabel: "x Label here",
//   yAxis: {
//     scaleType: "linear",
//     display: true,
//     position: "left",
//   },
  yCol: "y_column",
//   yLabel: "y Label here",
//   title: "My  Scatterplot",
  grid: {
    rows: true,
    columns: false,
  },
  data: Sample2dData,
  type: "continuous"
};