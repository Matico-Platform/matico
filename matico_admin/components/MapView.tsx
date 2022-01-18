import DeckGL from "@deck.gl/react";
import { MVTLayer } from "@deck.gl/geo-layers";
import { StaticMap } from "react-map-gl";

const INITIAL_VIEW_STATE = {
  longitude: -74.006,
  latitude: 40.7128,
  zoom: 10,
  pitch: 0,
  bearing: 0,
};

export interface MapViewInterface {
  datasetId: string;
}
export const MapView: React.FC<MapViewInterface> = ({ datasetId }) => {
  const url = `/api/tiler/dataset/${datasetId}/{z}/{x}/{y}`;
  const layer = new MVTLayer({
    data: url,
    // @ts-ignore
    getLineColor: [255, 0, 0, 255],
    getLineWidth: 1,
    lineWidthUnits: "pixels",
    getFillColor: [226, 125, 96, 200],
    getBorderColor: [200, 200, 200],
    getRadius: 40,
    stroked: true,
    pickable: true,
    autoHighlight: true,
    highlightColor: [200, 100, 200, 200],
    radiusUnits: "pixels",
  });
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        margin: "0px",
        padding: "0px",
      }}
    >
      <DeckGL
        style={{ position: "absolute" }}
        width="100%"
        height="100%"
        controller={true}
        initialViewState={INITIAL_VIEW_STATE}
        layers={[layer]}
      >
        <StaticMap
          mapboxApiAccessToken="pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiY2t1dThkcG1xM3p2ZzJ3bXhlaHFtdThlYiJ9.rmndXXXrC5HAbxg1Ok8XTg"
          mapStyle="mapbox://styles/mapbox/dark-v10"
          width={"100%"}
          height={"100%"}
        />
      </DeckGL>
    </div>
  );
};
