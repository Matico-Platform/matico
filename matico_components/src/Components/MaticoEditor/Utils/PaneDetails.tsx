import React from "react";
import HistogramIcon from "@spectrum-icons/workflow/Histogram";
import TextIcon from "@spectrum-icons/workflow/Text";
import PieChartIcon from "@spectrum-icons/workflow/GraphPie";
import MapIcon from "@spectrum-icons/workflow/MapView";
import ScatterIcon from "@spectrum-icons/workflow/GraphScatter";
import PropertiesIcon from "@spectrum-icons/workflow/Properties";
import Calendar from "@spectrum-icons/workflow/Calendar";
import LineChartIcon from "@spectrum-icons/workflow/GraphTrend";

import Border from "@spectrum-icons/workflow/Border";
import {
    ContainerPane,
    Layer,
    Pane,
    PanePosition
} from "@maticoapp/matico_types/spec";
import { v4 as uuid } from "uuid";
import { MaticoTextPaneComponents as text } from "Components/Panes/MaticoTextPane";

export const IconForPaneType = (PaneType: string, props?: any) => {
    switch (PaneType) {
        case "histogram":
            return <HistogramIcon {...props} />;
        case "pieChart":
            return <PieChartIcon {...props} />;
        case "text":
            const El = text.icon;
            // @ts-ignore
            return <El {...props} />;
        case "map":
            return <MapIcon {...props} />;
        case "scatterplot":
            return <ScatterIcon {...props} />;
        case "lineChart":
            return <LineChartIcon {...props} />;
        case "controls":
            return <PropertiesIcon {...props} />;
        case "container":
            return <Border {...props} />;
        case "staticMap":
            return <MapIcon {...props} />;
        case "dateTimeSlider":
            return <Calendar {...props} />;
    }
};

type AvaliablePanesSection = {
    sectionTitle: string;
    panes: Array<{
        name:
            | "map"
            | "histogram"
            | "pieChart"
            | "text"
            | "scatterplot"
            | "lineChart"
            | "controls"
            | "staticMap"
            | "dateTimeSlider"
            | "container";
        label: string;
    }>;
};

export const AvaliablePanes: Array<AvaliablePanesSection> = [
    {
        sectionTitle: "Visualizations",
        panes: [
            { name: "map", label: "Map" },
            { name: "histogram", label: "Histogram" },
            { name: "pieChart", label: "Pie Chart" },
            { name: "text", label: "Text" },
            { name: "scatterplot", label: "Scatter Plot" },
            { name: "lineChart", label: "Line Chart" },
            { name: "controls", label: "Controls" },
            { name: "container", label: "Container" },
            { name: "staticMap", label: "Simple Map" },
            { name: "dateTimeSlider", label: "Date / Time Slider" }
        ]
    }
];

export const DefaultPosition: PanePosition = {
    x: 25,
    y: 25,
    width: 300,
    height: 300,
    float: false,
    layer: 1,
    xUnits: "percent",
    yUnits: "percent",
    widthUnits: "pixels",
    heightUnits: "pixels",
    padLeft: 0,
    padRight: 0,
    padTop: 0,
    padBottom: 0,
    padUnitsLeft: "pixels",
    padUnitsRight: "pixels",
    padUnitsTop: "pixels",
    padUnitsBottom: "pixels"
};

export const FullPosition: PanePosition = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    float: false,
    layer: 1,
    xUnits: "percent",
    yUnits: "percent",
    widthUnits: "percent",
    heightUnits: "percent",
    padLeft: 0,
    padRight: 0,
    padTop: 0,
    padBottom: 0,
    padUnitsLeft: "pixels",
    padUnitsRight: "pixels",
    padUnitsTop: "pixels",
    padUnitsBottom: "pixels"
};

const DefaultView = {
    lat: 40.794983,
    lng: -73.96772,
    zoom: 13,
    bearing: 0,
    pitch: 0
};

export const DefaultLayer: Partial<Layer> = {
    name: "NewLayer",
    style: {
        fillColor: { rgb: [255.0, 0.0, 0.0] },
        lineColor: { rgb: [255.0, 255.0, 255.0] },
        size: 10,
        elevation: 0,
        lineWidth: 4,
        lineWidthScale: 1,
        lineUnits: "pixels",
        radiusScale: 1,
        radiusUnits: "pixels",
        visible: true,
        opacity: 1.0,
        elevationScale: 1.0
    }
};

export const PaneDefaults: Record<string, Partial<Pane>> = {
    map: {
        name: "New Map",
        view: DefaultView,
        layers: [],
        baseMap: { type: "named", name: "CartoDBVoyager", affiliation: "" },
        controls: {
            scale: true,
            geolocate: true,
            navigation: true,
            fullscreen: true
        },
        selectionOptions: {
            selectionEnabled: false,
            selectionMode: "rectangle"
        }
    },
    staticMap: {
        name: "New Map",
        layers: [],
        showGraticule: false,
        projection: "geoOrthographic"
    },
    scatterplot: {
        name: "New Scatter",
        xColumn: null,
        yColumn: null,
        dotColor: { rgb: [1.0, 0.0, 0.0] },
        dotSize: 14,
        dataset: { name: "uknown", filters: [] }
    },
    lineChart: {
        name: "New Line Chart",
        xColumn: null,
        yColumn: null,
        lineColor: { rgb: [1.0, 0.0, 0.0] },
        lineWidth: 14,
        dataset: { name: "uknown", filters: [] }
    },
    histogram: {
        name: "New Histogram",
        column: null,
        color: { rgb: [1.0, 0, 0, 0, 0] },
        maxbins: 20,
        dataset: { name: "unknown", filters: [] }
    },
    pieChart: {
        name: "New Pie chart",
        column: null,
        dataset: { name: "unknown", filters: [] }
    },
    text: text.defaults,
    controls: {
        name: "Controls",
        title: "Controls",
        controls: []
    },
    container: {
        name: "Container",
        layout: { type: "free" },
        panes: []
    },
    dateTimeSlider: {
        name: "DateTimeSlider",
        column: null,
        dataset: { name: "unknown", filters: [] }
    }
};

export type ContainerPresetTypes =
    | "full"
    | "mainSideBar"
    | "row"
    | "column"
    | "tabs";

export const containerPreset = (
    name: string,
    presetType: ContainerPresetTypes
) => {
    switch (presetType) {
        case "full":
            let full = {
                id: uuid(),
                name: name,
                layout: { type: "free", allowOverflow: false },
                type: "container",
                panes: []
            };
            return { container: full, additionalPanes: [] };

        case "column":
            let rowContainer = {
                id: uuid(),
                name: name,
                type: "container",
                layout: {
                    type: "linear",
                    gap: "small",
                    direction: "row",
                    justify: "start",
                    align: "center",
                    allowOverflow: true
                },
                panes: []
            };
            return { container: rowContainer, additionalPanes: [] };

        case "row":
            let columnContainer = {
                id: uuid(),
                name: name,
                type: "container",
                layout: {
                    type: "linear",
                    gap: "small",
                    direction: "column",
                    justify: "start",
                    align: "center",
                    allowOverflow: true
                },
                panes: []
            };
            return { container: columnContainer, additionalPanes: [] };

        case "tabs":
            let tabOne = {
                id: uuid(),
                type: "container",
                name: `${name}: Tab 1`,
                layout: { type: "free", allowOverflow: false },
                panes: []
            };
            let tabTwo = {
                id: uuid(),
                type: "container",
                name: `${name}: Tab 2`,
                layout: { type: "free", allowOverflow: false },
                panes: []
            };
            let tabContainer = {
                id: uuid(),
                name: name,
                type: "container",
                layout: { type: "tabs", tabBarPosition: "horizontal" },
                panes: [
                    {
                        id: uuid(),
                        type: "container",
                        paneId: tabOne.id,
                        position: { ...FullPosition, width: 100, heigh: 100 }
                    },
                    {
                        id: uuid(),
                        type: "container",
                        paneId: tabTwo.id,
                        position: { ...FullPosition, width: 100, heigh: 100 }
                    }
                ]
            };
            return {
                container: tabContainer,
                additionalPanes: [tabOne, tabTwo]
            };

        case "mainSideBar":
            let MainContentPane = {
                id: uuid(),
                type: "container",
                name: `${name}: Main`,
                layout: { type: "free", allowOverflow: false },
                panes: []
            };

            let SideBar = {
                id: uuid(),
                type: "container",
                name: `${name}: SideBar`,
                layout: {
                    type: "linear",
                    direction: "column",
                    gap: "small",
                    allowOverflow: true,
                    justify: "start",
                    align: "center"
                },
                panes: []
            };

            let mainSideBarHorizontal = {
                id: uuid(),
                type: "container",
                name: name,
                layout: {
                    type: "linear",
                    direction: "row",
                    gap: "small",
                    justify: "start",
                    align: "center",
                    allowOverflow: false
                },
                panes: [
                    {
                        id: uuid(),
                        type: "container",
                        paneId: MainContentPane.id,
                        position: { ...FullPosition, width: 70 }
                    },
                    {
                        id: uuid(),
                        type: "container",
                        paneId: SideBar.id,
                        position: { ...FullPosition, width: 30 }
                    }
                ]
            };

            return {
                container: mainSideBarHorizontal,
                additionalPanes: [MainContentPane, SideBar]
            };

        default:
            throw `Unsupported container layout ${presetType}`;
    }
};
