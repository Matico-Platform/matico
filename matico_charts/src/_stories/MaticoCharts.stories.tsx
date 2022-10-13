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
} from "./SampleData";

import { PieChartColors } from "./SampleStyling";

import * as scale from '@visx/scale';

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

// Static Map Example 1:
// Filling with a single color, graticules on
export const StaticMapChart = Template.bind({});
StaticMapChart.args = {
  title: "Counties In California",
  yExtent: [0,100],
  xExtent: [0,100],
  layers: [
    {
      type: "map",
      fill: "red",
      proj: "geoTransverseMercator"
    },
  ],
  data: SampleMapData,
};

// Static Map Example 2:
// Filling with a single color, graticules off
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

// Static Map Example 3:
// Filling with a boolean-based scheme
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

// Static Map Example 4:
// Testing error message for proj
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

// Sample coloring function for the next example
var colorArea = scale.scaleLinear({
  domain: [
      Math.min(...SampleMapData2.map((f) => f.properties["estimate"])),
      Math.max(...SampleMapData2.map((f) => f.properties["estimate"])),
  ],
  range: ["Purple", "Orange"],
});

// Static Map Example 5: 
// Passing in a custom area-coloring function
export const StaticMapChartScale = Template.bind({});
StaticMapChartScale.args = {
  title: "Median Income in Illinois Counties",
  yExtent: [0,100],
  xExtent: [0,100],
  proj: "geoEquirectangular",
  layers: [
    {
      type: "map",
      fill: (datum) => colorArea(datum["estimate"]),
    },
  ],
  data: SampleMapData2
}

// Static Map Example 6:
// Displaying point data 
export const StaticMapChartPoint = Template.bind({});
StaticMapChartPoint.args = {
  title: "Testing point data",
  yExtent: [0,100],
  xExtent: [0,100],
  proj: "geoEquirectangular",
  pointRadius: 4,
  fill: "green",
  layers: [
    {
      type: "map",
    }
  ],
  data: SampleMapData3
}

// Static Map Example 7:
// Displaying lines only
export const StaticMapChartLine = Template.bind({});
StaticMapChartLine.args = {
  title: "Testing line data",
  yExtent: [0,100],
  xExtent: [0,100],
  proj: "geoEquirectangular",
  strokeWidth: 2,
  strokeColor: "red",
  layers: [
    {
      type: "map",
      fill: "black"
    }
  ],
  data: SampleMapData4
}

// Static Map Example 8:
// Displaying polygons (e.g. rectangle)
export const StaticMapChartPoly = Template.bind({});
StaticMapChartPoly.args = {
  title: "Testing polygon data",
  yExtent: [0,100],
  xExtent: [0,100],
  proj: "geoEquirectangular",
  layers: [
    {
      type: "map",
      fill: "white"
    }
  ],
  data: SampleMapData5
}

// Static Map Example 9:
// Displaying both polygons and lines
export const StaticMapChartLinePolyMix = Template.bind({});
StaticMapChartLinePolyMix.args = {
  title: "Testing a mix of polygon and line data",
  yExtent: [0,100],
  xExtent: [0,100],
  proj: "geoEquirectangular",
  layers: [
    {
      type: "map",
      fill: "red"
    }
  ],
  data: SampleMapData6
}