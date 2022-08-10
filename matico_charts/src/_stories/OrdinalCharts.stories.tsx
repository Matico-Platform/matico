import React from "react";
import { Story, Meta } from "@storybook/react";

import MaticoChart from "../components/MaticoChart";
import { ChartSpaceSpec } from "../components/types";
import { Stats } from '@visx/mock-data/lib/generators/genStats';
import { BoxPlotStats } from "../components/types";

import {
  Sample2dData,
  SampleCategoricalData,
  SampleHistogramData,
  SampleDistData
} from "./SampleData";

import { PieChartColors } from "./SampleStyling";

export default {
  title: "Matico/Ordinal Charts",
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


export const HorizontalHistogram = Template.bind({});
HorizontalHistogram.args = {
  yCol: "x1",
  yExtent: [SampleHistogramData.min, SampleHistogramData.max],
  yLabel: "Scale of Something",
  xCol: "count",
  xAxis: {
    scaleType: "linear",
    position: "bottom",
  },
  xLabel: "Count of Something",
  title: "My Histogram",
  grid: {
    rows: true,
    columns: false
  },
  layers: [
    {
      type: "bar",
      color: "steelblue",
      horizontal: true
    },
  ],
  data: SampleHistogramData.binned,
};

export const HorizontalOrdinal = Template.bind({});
HorizontalOrdinal.args = {
  yCol: "label",
  yExtent: SampleCategoricalData.map(f => f.label), // aka keys
  yAxis: {
    scaleType: "band",
    position: "left"
  },
  xAxis: {
    scaleType: "linear",
    position: "bottom",
  },
  xExtent: [0, Math.max(...SampleCategoricalData.map(f => f.count))],
  xCol: "count",
  xLabel: "Votes for Emoji to Win Best Actor", 
  title: "Emojis per Capita",
  layers: [
    {
      type: "bar",
      color: "teal",
      padding: .5,
      horizontal: true
    },
  ],
  data: SampleCategoricalData,
};

export const VerticalBoxAndViolin = Template.bind({});
VerticalBoxAndViolin.args = {
  title: "My Boxplot/Violinplot",
  xAxis: {
    scaleType: "band",
    position: "bottom"
  },
  yAxis: {
    scaleType: "linear",
    position: "left"
  },
  yExtent: [-10, 25], //Math.min(...SampleDistData.map(x => Math.min(x.boxPlot.min, ...x.boxPlot.outliers)))
  layers: [
    {
      type: "dist",
      showBoxPlot: true,
      showViolinPlot: true,
      boxPlotStroke: "green",
      violinPlotStroke: "red",
      horizontal: false,
    },
  ],
  data: SampleDistData,
};

export const HorizontalBoxAndViolin = Template.bind({});
HorizontalBoxAndViolin.args = {
  title: "My Boxplot/Violinplot",
  yAxis: {
    scaleType: "band",
    position: "bottom"
  },
  xAxis: {
    scaleType: "linear",
    position: "left"
  },
  xExtent: [-10, 25], //Math.min(...SampleDistData.map(x => Math.min(x.boxPlot.min, ...x.boxPlot.outliers)))
  layers: [
    {
      type: "dist",
      showBoxPlot: true,
      showViolinPlot: true,
      boxPlotStroke: "green",
      violinPlotStroke: "red",
      horizontal: true,
    },
  ],
  data: SampleDistData,
};