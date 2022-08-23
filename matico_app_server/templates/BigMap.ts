import {App} from "@maticoapp/types/spec"

export const BigMap:  App = {
  "pages": [
    {
      "name": "Map",
      "id": "5ac6dd19-84b8-4937-9610-2be88f8c0064",
      "icon": "fas fa-globe-europe",
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
      "name": "New Pane",
      "id": "55858c45-a205-4a72-bfb1-1c7d7e9a338b",
      "view": {
        "lat": 48.98772038333429,
        "lng": 6.194690265486743,
        "zoom": 3.6366456031414027,
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
                }
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
    "name": "Big Map",
    "createdAt": "2022-08-23T22:14:52.569Z",
    "description": "Just a big map. Not much else (yet)!"
  }
}
