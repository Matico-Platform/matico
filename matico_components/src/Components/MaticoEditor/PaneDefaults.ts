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

export const PaneDefaults = {
  Page:{
    name:"",
    path:"/",
    sections:[],
    order:2,
    content:'',
    icon: "Page"
  },
  Layer: {
    name: "NewLayer",
    style: {
      fillColor: "#FF0000",
      lineColor: "#FFFFFF",
      size: 10,
      elevation:0,
      lineWidth: 4,
      lineWidthScale:1,
      lineUnites:'pixels',
      radiusScale:1,
      radiusUnits:"pixels"
    },
    order: 1,
  },
  Section:{
    name:"New Section",
    order:1,
    panes:[],
    layout:"free"
  },
  Map: {
    position: DefaultPosition,
    name: "New Map",
    view: DefaultView,
    layers: [],
    base_map: { Named: "Terrain" },
  },
  Scatterplot: {
    position: DefaultPosition,
    name: "New Scatter",
    x_column: null,
    y_column: null,
    dot_color: "#417505",
    dot_size: 14,
    dataset: { name: "uknown" },
  },
  Histogram: {
    position: DefaultPosition,
    name: "New Histogram",
    column: null,
    color: "#417505",
    step: 140,
    dataset: { name: "unknown" },
    maxbins: 10
  },
  PieChart: {
    position: DefaultPosition,
    name: "New Pie chart",
    column: null,
    dataset: { name: "uknown" },
  },
  Text: {
    position: DefaultPosition,
    content: "New Text Pane",
    name: "Text Pane",
  },
  Controls:{
    position: DefaultPosition,
    name:"Controls",
    title:"Controls",
    controls : []
  },
  Container:{
    position: DefaultPosition,
    name:"Container",
    title:"Container",
    layout:"linear",
    panes:[]
  }
};
