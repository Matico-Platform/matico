import {Layer, Pane} from "@maticoapp/matico_types/spec";

const DefaultPosition = {
  x: 25,
  y: 25,
  width: 300,
  height: 300,
  float: false,
  layer: 1,
  x_units:"Percent",
  y_units:"Percent",
  width_units:"Pixels",
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
    baseMap: { type: "named", name: "CartoDBVoyager"  },
  },
  scatterplot: {
    name: "New Scatter",
    xColumn: null,
    yColumn: null,
    dotColor: "#417505",
    dotSize: 14,
    dataset: { name: "uknown", filters:[]},
  },
  histogram: {
    name: "New Histogram",
    column: null,
    color: "#417505",
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
