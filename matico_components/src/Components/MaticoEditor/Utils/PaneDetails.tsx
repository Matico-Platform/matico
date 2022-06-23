import React from 'react'
import HistogramIcon from "@spectrum-icons/workflow/Histogram";
import TextIcon from "@spectrum-icons/workflow/Text";
import PieChartIcon from "@spectrum-icons/workflow/GraphPie";
import MapIcon from "@spectrum-icons/workflow/MapView";
import ScatterIcon from "@spectrum-icons/workflow/GraphScatter";
import PropertiesIcon from "@spectrum-icons/workflow/Properties";
import Border from "@spectrum-icons/workflow/Border";

export const IconForPaneType = (PaneType: string) => {
    switch (PaneType) {
        case "histogram":
            return <HistogramIcon />;
        case "pieChart":
            return <PieChartIcon />;
        case "text":
            return <TextIcon />;
        case "map":
            return <MapIcon />;
        case "scatterplot":
            return <ScatterIcon />;
        case "controls":
            return <PropertiesIcon />;
        case "container":
            return <Border />;
    }
};




type AvaliablePanesSection= {
  sectionTitle:string, 
  panes: Array<{name: "map"| "histogram" | "pieChart" | "text" | "scatterplot" | "controls" | "container", label:string}>
}

export const AvaliablePanes : Array<AvaliablePanesSection> = [
    {
        sectionTitle: "Visualizations",
        panes: [
            { name: "map", label: "Map" },
            { name: "histogram", label: "Histogram" },
            { name: "pieChart", label: "Pie Chart" },
            { name: "text", label: "Text" },
            { name: "scatterplot", label: "Scatter Plot" },
            { name: "controls", label: "Controls" },
            { name: "container", label: "Container" }
        ]
    }
];

import {Layer, Pane} from "@maticoapp/matico_types/spec";

export const DefaultPosition = {
  x: 25,
  y: 25,
  width: 300,
  height: 300,
  float: false,
  layer: 1,
  x_units:"Percent",
  y_units:"Percent", width_units:"Pixels",
  height_units:"Pixels"
};

const DefaultView = {
  lat: 40.794983,
  lng: -73.96772,
  zoom: 13,
  bearing: 0,
  pitch: 0,
};


export const DefaultLayer: Partial<Layer>= {
    name: "NewLayer",
    style: {
      fillColor: {rgb:[255.0,0.0,0.0]},
      lineColor: {rgb:[255.0,255.0,255.0]},
      size: 10,
      elevation:0,
      lineWidth: 4,
      lineWidthScale:1,
      lineUnits:'pixels',
      radiusScale:1,
      radiusUnits:"pixels",
      visible:true,
      opacity:1.0,
      elevationScale:1.0
    },
}

export const PaneDefaults :Record<string, Partial<Pane>> = {
  map: {
    name: "New Map",
    view: DefaultView,
    layers: [],
    baseMap: { type: "named", name: "CartoDBVoyager", affiliation:"" },
  },
  scatterplot: {
    name: "New Scatter",
    xColumn: null,
    yColumn: null,
    dotColor: {rgb:[1.0,0.0,0.0]},
    dotSize: 14,
    dataset: { name: "uknown", filters:[]},
  },
  histogram: {
    name: "New Histogram",
    column: null,
    color: {rgb:[1.0,0,0,0,0]},
    maxbins: 20,
    dataset: { name: "unknown", filters:[] },
  },
  pieChart: {
    name: "New Pie chart",
    column: null,
    dataset: { name: "unknown", filters:[] },
  },
  text: {
    content: "New Text Pane",
    name: "Text Pane",
  },
  controls:{
    name:"Controls",
    title:"Controls",
    controls:[]
  },
  container:{
    name:"Container",
    title:"Container",
    layout:{"type":"free"},
    panes:[]
  }
};
