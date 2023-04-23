import React, {
    useState,
    useMemo,
    useRef,
    useCallback,
    useEffect,
    useLayoutEffect
} from "react";
import { View as MaticoView } from "@maticoapp/matico_spec";
import type { MaticoPaneInterface } from "../Pane";
import Map, {
    ScaleControl,
    GeolocateControl,
    NavigationControl,
    useControl,
    FullscreenControl
} from "react-map-gl";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { MaticoMapLayer } from "./MaticoMapLayer";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { MaticoLegendPane } from "../MaticoLegendPane/MaticoLegendPane";
import { Layer, MapControls } from "@maticoapp/matico_types/spec";
import { MapboxOverlayProps, MapboxOverlay } from "@deck.gl/mapbox/typed";
import { ScatterplotLayer } from "@deck.gl/layers";
import maplibregl from "maplibre-gl";
import { v4 as uuid } from "uuid";
import "maplibre-gl/dist/maplibre-gl.css";
import { SelectionOptions } from "@maticoapp/matico_types/spec";
import { MaticoSelectionLayer } from "./MaticoSelectionLayer";
import { debounce } from "lodash";
import { useMaticoMapView } from "Hooks/useMaticoMapView";
import { useResizeEvent } from "Hooks/useResizeEvent";

//@ts-ignore
function DeckGLOverlay(props: MapboxOverlayProps) {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
}

const PlaceholderLayer = new ScatterplotLayer({
    id: "PLACEHOLDER",
    data: [],
    getPosition: (d) => [0, 0],
    getRadius: 0,
    getFillColor: [0, 0, 0]
});

const accessToken =
    "pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiY2t1dThkcG1xM3p2ZzJ3bXhlaHFtdThlYiJ9.rmndXXXrC5HAbxg1Ok8XTg";

export interface MaticoMapPaneInterface extends MaticoPaneInterface {
    view: MaticoView;
    //TODO WE should properly type this from the @maticoapp/matico_spec library. Need to figure out the Typescript integration better or witx
    baseMap?: any;
    layers?: Array<any>;
    controls: MapControls;
    selectionOptions: SelectionOptions;
}

export function getNamedStyleJSON(style: string, accessToken: string) {
    switch (style) {
        case "CartoDBPositron":
            return "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
        case "CartoDBVoyager":
            return "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
        case "CartoDBDarkMatter":
            return "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
        case "Light":
            return `https://api.maptiler.com/maps/basic-v2/?key=32rtUQVfWVrA5316PfSR#1.0/0.00000/0.00000`;
        case "Dark":
            return `https://api.maptiler.com/maps/hybrid/style.json?key=32rtUQVfWVrA5316PfSR`;
        case "Satelite":
            return "https://api.maptiler.com/maps/hybrid/style.json?key=32rtUQVfWVrA5316PfSR";
        case "Terrain":
            return `https://api.maptiler.com/maps/topo/style.json?key=32rtUQVfWVrA5316PfSR`;
        case "Streets":
            return `https://api.maptiler.com/maps/streets/style.json?key=32rtUQVfWVrA5316PfSR`;
        default:
            return "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
    }
}

export const MaticoMapPane: React.FC<MaticoMapPaneInterface> = ({
    view,
    baseMap,
    name,
    layers,
    id,
    controls,
    selectionOptions
}) => {
    const [mapLayers, setMapLayers] = useState<Record<string, Layer>>({});
    const edit = useIsEditable();

    // DOM concerns
    const mapRef = useRef<any | null>();
    const parentRef = useRef();
    useResizeEvent(() => mapRef?.current?.resize(), parentRef);

    // map concerns
    const { currentView, updateViewState } = useMaticoMapView({
        view,
        id
    });

    const updateLayer = (id: string, layer: Layer) => {
        setMapLayers({ ...mapLayers, [id]: layer });
    };
    let mls = useMemo(
        () =>
            [...layers]
                .sort((a, b) => (a.order > b.order ? 1 : -1))
                .map((l) => mapLayers[l.id])
                .filter((a) => a),
        [layers, mapLayers]
    );
    let styleJSON = null;
    if (baseMap) {
        if (baseMap.type === "named") {
            styleJSON = getNamedStyleJSON(baseMap.name, accessToken);
        } else if (baseMap.StyleJSON) {
            styleJSON = baseMap.StyleJSON;
        }
    }

    return (
        <div
            ref={parentRef}
            key={id}
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden"
            }}
        >
            {currentView && currentView.type === "mapview" && (
                <>
                    <Map
                        mapLib={maplibregl}
                        key={id}
                        id={id}
                        ref={mapRef}
                        antialias={true}
                        onMove={updateViewState}
                        {...currentView?.value}
                        mapboxAccessToken={accessToken}
                        mapStyle={
                            styleJSON
                                ? styleJSON
                                : "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                        }
                    >
                        {controls?.navigation && (
                            <NavigationControl position="top-right" />
                        )}
                        {controls?.geolocate && (
                            <GeolocateControl position="top-right" />
                        )}
                        {controls?.fullscreen && (
                            <FullscreenControl position="top-right" />
                        )}
                        {controls?.scale && (
                            <ScaleControl position="top-right" />
                        )}
                        <DeckGLOverlay
                            interleaved={true}
                            width={"100%"}
                            height={"100%"}
                            layers={[...mls, PlaceholderLayer]}
                        />
                        {layers.map((l) => (
                            <MaticoMapLayer
                                key={l.name}
                                name={l.name}
                                source={l.source}
                                style={l.style}
                                onUpdate={(update) => updateLayer(l.id, update)}
                                mapPaneId={id}
                                beforeId={l.style.beforeId}
                                tooltipColumns={l.tooltipColumns}
                            />
                        ))}
                    </Map>
                    <MaticoLegendPane
                        legends={mls.map((l) => l.props._legend)}
                    />
                </>
            )}
        </div>
    );
};
