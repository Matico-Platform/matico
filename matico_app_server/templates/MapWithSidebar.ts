import {App} from "@maticoapp/types/spec"

export const MapWithSidebar:  App = {
  "pages": [
    {
      "name": "Map",
      "id": "5ac6dd19-84b8-4937-9610-2be88f8c0064",
      "icon": "fas fa-globe-europe",
      "panes": [
        {
          "id": "7b3c3d31-7307-47ca-a897-e967461119dc",
          "paneId": "675a0f7f-2f04-4e2c-b62b-f1dabe7337bb",
          "type": "container",
          "position": {
            "x": 0,
            "y": 0,
            "width": 100,
            "height": 100,
            "float": false,
            "layer": 1,
            "xUnits": "percent",
            "yUnits": "percent",
            "widthUnits": "percent",
            "heightUnits": "percent",
            "padLeft": 0,
            "padRight": 0,
            "padTop": 0,
            "padBottom": 0,
            "padUnitsLeft": "pixels",
            "padUnitsRight": "pixels",
            "padUnitsTop": "pixels",
            "padUnitsBottom": "pixels"
          }
        }
      ],
      "path": "/",
      "layout": {
        "type": "free",
        "allowOverflow": false
      }
    }
  ],
  "panes": [
    {
      "type": "map",
      "name": "Main Map",
      "id": "55858c45-a205-4a72-bfb1-1c7d7e9a338b",
      "view": {
        "lat": 48.98772,
        "lng": 6.19469,
        "zoom": 3.6366456,
        "bearing": 0,
        "pitch": 0
      },
      "layers": [
        {
          "name": "Europe Population Density",
          "id": "e753328e-1fe8-442d-b5df-089d4aa32525",
          "source": {
            "name": "Europe Demographics",
            "filters": []
          },
          "style": {
            "size": 10,
            "fillColor": {
              "variable": "Population Density (per Sq. Km)",
              "domain": {
                "dataset": "Europe Demographics",
                "column": "Population Density (per Sq. Km)",
                "metric": {
                  "type": "quantile",
                  "bins": 5
                },
                "filters": null,
                "featureId": null
              },
              "range": "RedOr.5"
            },
            "opacity": 1,
            "visible": true,
            "lineColor": {
              "rgb": [
                255,
                255,
                255
              ]
            },
            "lineWidth": 1,
            "lineWidthScale": 1,
            "lineUnits": "pixels",
            "radiusUnits": "pixels",
            "radiusScale": 1,
            "elevation": 0,
            "elevationScale": 1,
            "beforeId": null
          }
        }
      ],
      "baseMap": {
        "type": "named",
        "name": "CartoDBVoyager",
        "affiliation": ""
      },
      "controls": {
        "scale": true,
        "geolocate": true,
        "navigation": true,
        "fullscreen": true
      },
      "selectionOptions": {
        "selectionEnabled": false,
        "selectionMode": "rectangle"
      }
    },
    {
      "id": "d0a35353-8ecc-408b-9d51-afb31c043cc0",
      "type": "container",
      "name": "Map with Sidebar: Main",
      "layout": {
        "type": "free",
        "allowOverflow": false
      },
      "panes": [
        {
          "type": "map",
          "id": "3e6f603d-c02a-4d48-b189-e2e0bdd4f606",
          "paneId": "55858c45-a205-4a72-bfb1-1c7d7e9a338b",
          "position": {
            "width": 100,
            "height": 100,
            "layer": 1,
            "float": false,
            "x": 0,
            "y": 0,
            "padLeft": 0,
            "padRight": 0,
            "padTop": 0,
            "padBottom": 0,
            "xUnits": "percent",
            "yUnits": "percent",
            "widthUnits": "percent",
            "heightUnits": "percent",
            "padUnitsLeft": "pixels",
            "padUnitsRight": "pixels",
            "padUnitsTop": "pixels",
            "padUnitsBottom": "pixels"
          }
        }
      ]
    },
    {
      "id": "ffeab153-ca03-43ec-bf2c-b919c19cbe03",
      "type": "container",
      "name": "Map with Sidebar: SideBar",
      "layout": {
        "type": "linear",
        "direction": "column",
        "gap": "none",
        "allowOverflow": true,
        "justify": "start",
        "align": "center"
      },
      "panes": [
        {
          "id": "4e57f630-1e6d-4b6d-b033-e17c192d98c9",
          "paneId": "42e8bc48-a263-4a12-83c6-6dfa6f82be1a",
          "type": "text",
          "position": {
            "x": 25,
            "y": 25,
            "width": 300,
            "height": 232,
            "float": false,
            "layer": 1,
            "xUnits": "percent",
            "yUnits": "percent",
            "widthUnits": "pixels",
            "heightUnits": "pixels",
            "padLeft": 0,
            "padRight": 0,
            "padTop": 0,
            "padBottom": 0,
            "padUnitsLeft": "pixels",
            "padUnitsRight": "pixels",
            "padUnitsTop": "pixels",
            "padUnitsBottom": "pixels"
          }
        },
        {
          "id": "3d20bca9-702c-4bc5-b3f5-76e3d1848064",
          "paneId": "3cd6eb6e-2550-4853-bd39-3c3f277de88d",
          "type": "scatterplot",
          "position": {
            "x": 25,
            "y": 25,
            "width": 300,
            "height": 300,
            "float": false,
            "layer": 1,
            "xUnits": "percent",
            "yUnits": "percent",
            "widthUnits": "pixels",
            "heightUnits": "pixels",
            "padLeft": 0,
            "padRight": 0,
            "padTop": 0,
            "padBottom": 0,
            "padUnitsLeft": "pixels",
            "padUnitsRight": "pixels",
            "padUnitsTop": "pixels",
            "padUnitsBottom": "pixels"
          }
        },
        {
          "id": "6eb6634d-5510-4fe6-ada0-3af6bbab79d1",
          "paneId": "f33bdf52-0153-493d-a3ef-771aea0e0c33",
          "type": "text",
          "position": {
            "x": 25,
            "y": 25,
            "width": 300,
            "height": 148,
            "float": false,
            "layer": 1,
            "xUnits": "percent",
            "yUnits": "percent",
            "widthUnits": "pixels",
            "heightUnits": "pixels",
            "padLeft": 0,
            "padRight": 0,
            "padTop": 0,
            "padBottom": 0,
            "padUnitsLeft": "pixels",
            "padUnitsRight": "pixels",
            "padUnitsTop": "pixels",
            "padUnitsBottom": "pixels"
          }
        },
      ]
    },
    {
      "id": "675a0f7f-2f04-4e2c-b62b-f1dabe7337bb",
      "type": "container",
      "name": "Map with Sidebar",
      "layout": {
        "type": "linear",
        "direction": "row",
        "gap": "small",
        "justify": "start",
        "align": "center",
        "allowOverflow": false
      },
      "panes": [
        {
          "id": "f2473f76-961e-45a8-a805-71007461fd9a",
          "type": "container",
          "paneId": "d0a35353-8ecc-408b-9d51-afb31c043cc0",
          "position": {
            "x": 0,
            "y": 0,
            "width": 70,
            "height": 100,
            "float": false,
            "layer": 1,
            "xUnits": "percent",
            "yUnits": "percent",
            "widthUnits": "percent",
            "heightUnits": "percent",
            "padLeft": 0,
            "padRight": 0,
            "padTop": 0,
            "padBottom": 0,
            "padUnitsLeft": "pixels",
            "padUnitsRight": "pixels",
            "padUnitsTop": "pixels",
            "padUnitsBottom": "pixels"
          }
        },
        {
          "id": "ba0b39c8-425d-4d7d-b7fc-cf371fda3418",
          "type": "container",
          "paneId": "ffeab153-ca03-43ec-bf2c-b919c19cbe03",
          "position": {
            "x": 0,
            "y": 0,
            "width": 300,
            "height": 100,
            "float": false,
            "layer": 1,
            "xUnits": "percent",
            "yUnits": "percent",
            "widthUnits": "pixels",
            "heightUnits": "percent",
            "padLeft": 0,
            "padRight": 0,
            "padTop": 0,
            "padBottom": 0,
            "padUnitsLeft": "pixels",
            "padUnitsRight": "pixels",
            "padUnitsTop": "pixels",
            "padUnitsBottom": "pixels"
          }
        }
      ]
    },
    {
      "content": "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":1,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Population Density in Europe\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"heading\",\"version\":1,\"tag\":\"h1\"},{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Here's a quick chart to overview the map on the left. How about we look at any sort of relationship between median age by country and density?\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
      "name": "Title",
      "id": "42e8bc48-a263-4a12-83c6-6dfa6f82be1a",
      "type": "text"
    },
    {
      "name": "Age v Density",
      "xColumn": "Population Density (per Sq. Km)",
      "yColumn": "Median Age",
      "dotColor": {
        "rgb": [
          1,
          0,
          0
        ]
      },
      "dotSize": 3,
      "dataset": {
        "name": "Europe Demographics",
        "filters": []
      },
      "id": "3cd6eb6e-2550-4853-bd39-3c3f277de88d",
      "type": "scatterplot",
      "labels": {
        "title": "Age v Density"
      }
    },
    {
      "name": "New Pane",
      "column": "Area (Sq. Km)",
      "color": {
        "rgba": [
          248,
          0,
          0,
          255
        ]
      },
      "maxbins": 23,
      "dataset": {
        "name": "Europe Demographics",
        "filters": []
      },
      "id": "675d16b8-2409-457c-bd07-c874a1aba0f7",
      "type": "histogram"
    },
    {
      "name": "New Pane",
      "column": "Percent Immigrants Population",
      "dataset": {
        "name": "Europe Demographics",
        "filters": []
      },
      "id": "893abb17-1339-4d95-a2d1-b61fee7bbd7d",
      "type": "pieChart"
    },
    {
      "content": "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"font-size: 10px;\",\"text\":\"This data comes from the EU Open Data portal. This map was built using the Matico editor with data from OpenStreetMap Contributors, Maplibre, and tiles served by Maptiler.\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
      "name": "Citation",
      "id": "f33bdf52-0153-493d-a3ef-771aea0e0c33",
      "type": "text"
    }
  ],
  "datasets": [
    {
      "type": "geoJSON",
      "name": "Europe Demographics",
      "url": "https://raw.githubusercontent.com/Matico-Platform/sample-data/main/eu-data/eu.geojson"
    }
  ],
  "theme": null,
  "metadata": {
    "name": "Map With Sidebar",
    "createdAt": "2022-08-23T22:14:52.569Z",
    "description": "On the left, a map. On the right, anything you can dream of that we currently support."
  }
}