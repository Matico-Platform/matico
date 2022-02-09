import React from "react";
import { Story, Meta } from "@storybook/react";

import MaticoChart from "../components/MaticoChart";
import { ChartSpaceSpec } from "../components/types";

import {
  Sample2dData,
  SampleCategoricalData,
  SampleHistogramData,
} from "./SampleData";

import { PieChartColors } from "./SampleStyling";

export default {
  title: "Matico/Continuous Charts",
  component: MaticoChart,
  argTypes: {
    onClick: { action: "clicked" },
  },
} as Meta<typeof MaticoChart>;

const Template: Story<ChartSpaceSpec> = (args) => (
  <div
    style={{
      width: "calc(50%-20px)",
      height: "600px",
    }}
  >
    <MaticoChart {...args} />
  </div>
);

export const ScatterChart = Template.bind({});
ScatterChart.args = {
  layers: [
    {
      type: "scatter",
      color: "steelblue",
      scale: 2,
    },
  ],
  xCol: "x_column",
  xAxis: {
    scaleType: "linear",
    display: true,
    position: "bottom",
  },
  xLabel: "x Label here",
  yAxis: {
    scaleType: "linear",
    display: true,
    position: "left",
  },
  yCol: "y_column",
  yLabel: "y Label here",
  title: "My  Scatterplot",
  grid: {
    rows: true,
    columns: false,
  },
  data: Sample2dData,
};

export const PieChart = Template.bind({});
PieChart.args = {
  layers: [
    {
      type: "pie",
      color: ({ label }) => PieChartColors[label],
      padding: 0.2,
      innerRadius: 0.5,
      // onClick: ({ label }) => {
      //   alert(`${label} is the emoji you clicked`);
      //   try {
      //     document.title = label + label + label + label + label + label;
      //   } catch {}
      // },
      valueAccessor: (d) => d.count,
      labelAccessor: (d) => d.label,
      reverseSort: false,
    },
  ],
  categorical: true,
  title: "My Favorite Emoji",
  subtitle: "by number of occurrences in very serious comments",
  attribution: "Data from my data source",
  data: SampleCategoricalData,
};
export const Histogram = Template.bind({});
Histogram.args = {
  data: SampleHistogramData.binned,
  xCol: "x0",
  xExtent: [SampleHistogramData.min, SampleHistogramData.max],
  xLabel: "Scale of Something",
  xAxis: {
    scaleType: "linear",
    position: "bottom",
  },
  yCol: "count",
  yLabel: "Count of Something",
  title: "My Histogram",
  subtitle: "Click to brush and check that console!!!",
  grid: {
    rows: true,
    columns: false
  },
  useBrush: {
    horizontal: true,
    vertical: false,
  },
  onBrush: (e) => console.table(e),
  layers: [
    {
      type: "bar",
      color: "steelblue",
      scale: 2,
      padding: 0.1,
    },
  ],
};

export const HistogramWithScatterplot = Template.bind({});

HistogramWithScatterplot.args = {
  data: SampleHistogramData.binned,
  xCol: "x0",
  xExtent: [SampleHistogramData.min, SampleHistogramData.max],
  xLabel: "Scale of Something",
  xAxis: {
    scaleType: "linear",
    position: "bottom",
  },
  yCol: "count",
  yLabel: "Count of Something",
  title: "My Histogram",
  subtitle: "Click to brush and check that console!!!",
  grid: {
    rows: true,
    columns: false
  },
  useBrush: {
    horizontal: true,
    vertical: false,
  },
  onBrush: (e) => console.table(e),
  layers: [
    {
      type: "bar",
      color: "steelblue",
      scale: 2,
      padding: 0.1,
    },
    {
      data: Sample2dData,
      type: "scatter",
      color: "rgba(70,130,180,0.2)",
      scale: 2,
      xAccessor: d => (d["x_column"]),
      yAccessor: () => 0,
      yOffset: 20
    }
  ],
};





export const Chartspace = Template.bind({});
Chartspace.args = {
  xAxis: {
    scaleType: "linear",
    display: true,
  },
  yAxis: {
    scaleType: "linear",
    display: true,
  },
  grid: true,
  xCol: "x_column",
  yCol: "y_column",
  data: Sample2dData,
};
