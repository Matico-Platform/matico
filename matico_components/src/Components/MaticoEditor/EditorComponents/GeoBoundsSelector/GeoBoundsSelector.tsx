import React, { useMemo, useState } from "react";
import { ParentSize } from '@visx/responsive';
import { GeoBoundsSelectorProps, MapView } from "./types";
import { View } from "@adobe/react-spectrum";
import DeckGL from "@deck.gl/react";
import {
  PolygonLayer,
  GeoJsonLayer
} from "@deck.gl/layers";
import { fitBounds, normalizeViewportProps, pixelsToWorld } from "@math.gl/web-mercator";
import { WebMercatorViewport } from '@deck.gl/core';

interface GeoBoundsSelectorInnerProps {
  mapView: MapView
  updateView: (props: any) => void
  width: number
  height: number
}

interface FeatureShape {
  type: 'GeometryCollection';
  geometry: { coordinates: [number, number][][]; type: 'Polygon' };
  properties: { name: string };
}

const boundsToPolygons = (points: [[number, number], [number, number]]): number[][] => {
  if (points && points[0]?.length && points[1]?.length) {
    const [x1, y1] = points[0];
    const [x2, y2] = points[1];
    return [
      [x1, y1],
      [x1, y2],
      [x2, y2],
      [x2, y1],
      [x1, y1]
    ]
  } else {
    return [[]]
  }
}

const DEFAULT_SCREEN_SIZE = {
  width: 1376,
  height: 768
}

const GeoBoundsSelectorInner: React.FC<GeoBoundsSelectorInnerProps> = ({
  mapView,
  updateView,
  width,
  height
}) => {

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [highlightBounds, setHighlightBounds] = useState<[[number, number], [number, number]]>([[0, 0], [0, 0]]);

  const viewport = useMemo(() => {
    const tempViewport = new WebMercatorViewport({
      latitude: mapView.lat,
      longitude: mapView.lng,
      zoom: mapView.zoom,
      pitch: mapView.pitch,
      bearing: mapView.bearing,
      width: DEFAULT_SCREEN_SIZE.width,
      height: DEFAULT_SCREEN_SIZE.height
    });
    const nw = tempViewport.unproject([0, 0]);
    const se = tempViewport.unproject([1366, 768]);
    return [nw, se];
  }, [JSON.stringify(mapView)])

  const locatorMapView = useMemo(() => {
    return width + height > 0 ? fitBounds({
      width,
      height,
      padding: 50,
      bounds: [[
        -140, -50
      ], [
        140, 50
      ]]
    }) : {
      latitude: 0
    }
  }, [width, height])


  const handleToggleDrag = ({ coordinate }: { coordinate: [number, number] }) => {
    if (isDragging) { // end drag
      const {
        latitude: lat,
        longitude: lng,
        zoom: zoom
      } = fitBounds({
        width: DEFAULT_SCREEN_SIZE.width,
        height: DEFAULT_SCREEN_SIZE.height,
        bounds: [coordinate, highlightBounds[0]]
      })
      updateView({
        ...mapView,
        lat,
        lng,
        zoom
      })
      setIsDragging(prev => !prev);
    } else { // start drag
      setIsDragging(prev => !prev)
      setHighlightBounds([
        coordinate,
        coordinate
      ])

    }
  }

  const handleDrag = ({ coordinate }: { coordinate: [number, number] }) => isDragging && setHighlightBounds(prev => [prev[0], coordinate])

  const layers = [
    new GeoJsonLayer({
      id: 'geojson',
      data: 'https://raw.githubusercontent.com/Matico-Platform/sample-data/main/world/ne_110m_land.json',
      getFillColor: [120, 120, 120],
    }),
    new PolygonLayer({
      id: 'bg',
      data: [
        [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]]
      ],
      getFillColor: [255, 0, 0, 1],
      filled: true,
      pickable: true,
      // @ts-ignore
      getPolygon: f => f,
      // @ts-ignore
      onHover: handleDrag,
      // @ts-ignore
      onClick: handleToggleDrag,
    }),
    new PolygonLayer({
      id: 'drag-overlay',
      data: [boundsToPolygons(highlightBounds)],
      getFillColor: [255, 255, 0, 50],
      getLineColor: [255, 255, 0, 255],
      getLineWidth: 1,
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 1,
      filled: true,
      pickable: false,
      // @ts-ignore
      getPolygon: f => f,
      visible: isDragging,
      updateTriggers: {
        visible: isDragging
      }
    }),
    new PolygonLayer({
      id: 'current-viewport',
      data: [boundsToPolygons(viewport as [[number, number], [number, number]])],
      getFillColor: [200, 200, 255, 50],
      getLineColor: [255, 255, 255, 255],
      getLineWidth: 1,
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 1,
      filled: true,
      pickable: false,
      stroked: true,
      // @ts-ignore
      getPolygon: f => f
    })


  ]

  return <div
    style={{
      position: 'relative',
      width,
      height,
      cursor: 'crosshair'
    }}
    onMouseLeave={() => setIsDragging(false)}
  >
    <DeckGL
      controller={false}
      layers={layers}
      viewState={{
        ...locatorMapView,
        bearing: 0,
        pitch: 0
      }}
    />
  </div>
}

export const GeoBoundsSelector: React.FC<GeoBoundsSelectorProps> = ({
  updateView,
  mapView
}) => {
  return <View width="100%"><ParentSize>
    {parent => (
      <GeoBoundsSelectorInner
        width={parent.width}
        height={parent.width / 1.2}
        mapView={mapView}
        updateView={updateView}
      />
    )}
  </ParentSize></View>
}