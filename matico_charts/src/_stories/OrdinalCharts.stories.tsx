import React from "react";
import { Story, Meta } from "@storybook/react";

import MaticoChart from "../components/MaticoChart";
import { ChartSpaceSpec } from "../components/types";

import {
  SampleMapData,
  SampleMapData2,
  SampleCategoricalData,
  SampleHistogramData,
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

export const StaticMapChart = Template.bind({});
StaticMapChart.args = {
  title: "Counties In California",
  yExtent: [0,100],
  xExtent: [0,100],
  layers: [
    {
      type: "map",
      fill: "red",
      proj: "geoConicConformal"
    },
  ],
  data: SampleMapData,
};

export const StaticMapChartNoGrid = Template.bind({});
StaticMapChartNoGrid.args = {
  title: "Counties In California",
  yExtent: [0,100],
  xExtent: [0,100],
  layers: [
    {
      type: "map",
      fill: "red",
      proj: "geoConicConformal",
      gratOn: false
    },
  ],
  data: SampleMapData,
};

export const StaticMapChartFillFunc = Template.bind({});
StaticMapChartFillFunc.args = {
  title: "Counties In California",
  yExtent: [0,100],
  xExtent: [0,100],
  layers: [
    {
      type: "map",
      fill: (datum) => {return datum["Shape__Area"] < 3082164727 ? "red" : "green"},
      proj: "geoConicConformal"
    },
  ],
  data: SampleMapData,
};

export const StaticMapChartProjError = Template.bind({});
StaticMapChartProjError.args = {
  title: "Median Income in Illinois Counties",
  yExtent: [0,100],
  xExtent: [0,100],
  layers: [
    {
      type: "map",
      fill: "red",
      proj: "geoMercato"
    },
  ],
  data: SampleMapData2
}