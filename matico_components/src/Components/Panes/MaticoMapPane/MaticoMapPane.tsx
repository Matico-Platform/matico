import React, { useState, useMemo, useRef, useEffect } from "react";
import { View as MaticoView } from "@maticoapp/matico_spec";
import type { MaticoPaneInterface } from "../Pane";
import Map, { ScaleControl, GeolocateControl, NavigationControl, useControl, FullscreenControl} from "react-map-gl";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { MaticoMapLayer } from "./MaticoMapLayer";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { MaticoLegendPane } from "../MaticoLegendPane/MaticoLegendPane";
import { View } from "@adobe/react-spectrum";
import { Layer, MapControls} from "@maticoapp/matico_types/spec";
import {MapboxOverlayProps, MapboxOverlay} from "@deck.gl/mapbox/typed"
import {PolygonLayer} from "@deck.gl/layers";
import maplibregl from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';
import { SelectionOptions } from "@maticoapp/matico_types/spec";
import { MaticoSelectionLayer } from "./MaticoSelectionLayer";
import {debounce} from "lodash";


//@ts-ignore
function DeckGLOverlay(props: MapboxOverlayProps){
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props)); 
  overlay.setProps(props)
  return null
}

const PlaceholderLayer = new PolygonLayer({
    id: "PLACEHOLDER",
    data: []
})

const accessToken="pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiY2t1dThkcG1xM3p2ZzJ3bXhlaHFtdThlYiJ9.rmndXXXrC5HAbxg1Ok8XTg"

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
            return `https://api.mapbox.com/styles/v1/mapbox/light-v10?access_token=${accessToken}`
        case "Dark":
            return `https://api.mapbox.com/styles/v1/mapbox/dark-v10?access_token=${accessToken}`
        case "Satelite":
            return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9?access_token=${accessToken}`
        case "Terrain":
            return `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11?access_token=${accessToken}`
        case "Streets":
            return `https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=${accessToken}`
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
    const [mapLayers, setMapLayers] = useState<Record<string,Layer>>({});
    const [shouldRemount, setShouldRemount] = useState(false);
    const edit = useIsEditable();
    const mapRef = useRef();
    const parentRef = useRef();
    const triggerRemount = () => {
        setShouldRemount(true);
        setTimeout(() => setShouldRemount(false), 100);
    }

    useEffect(() => {
        const refObserver = new ResizeObserver(triggerRemount)
        refObserver.observe(parentRef.current);
        return () => {
            refObserver.disconnect();
        };
    }, []);

    const updateLayer = (id:string, layer: Layer) => {
        setMapLayers({...mapLayers, [id]:layer});
    };

    let mls = useMemo(()=> ([...layers]
        .sort((a, b) => (a.order > b.order ? 1 : -1))
        .map((l) =>
            mapLayers[l.id]
        )).filter(a=>a), [layers, mapLayers])

    const [currentView, updateView] = useAutoVariable({
        //@ts-ignore
        name: view.var ? view.var : `${name}_map_loc`,
        //@ts-ignore
        type: view.var ? undefined : "mapLocVar",
        //@ts-ignore
        initialValue: view.var ? undefined : view,
        //@ts-ignore
        bind: view.var ? view.bind : true
    });

    //TODO clean this up and properly type
    const updateViewState = debounce((viewStateUpdate: any) => {
        const viewState = viewStateUpdate.viewState;
        updateView({
            lat: viewState.latitude,
            lng: viewState.longitude,
            zoom: viewState.zoom,
            pitch: viewState.pitch,
            bearing: viewState.bearing
        });
    }, 500);

    let styleJSON = null;

    if (baseMap) {
        if (baseMap.type === "named") {
            styleJSON = getNamedStyleJSON(baseMap.name, accessToken);
        } else if (baseMap.StyleJSON) {
            styleJSON = baseMap.StyleJSON;
        }
    }


    // console.log("mls ", mls)

    // const selectionLayer = mapLayers.find(s=> s.id ==="selection") 
    // if (selectionLayer){
    //     mls.push(selectionLayer) 
    // }
    console.log('mls', mls)
    
    return (
        <div ref={parentRef} 
        key={id} 
        style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden"
        }}
        >
                {(currentView && !shouldRemount) && (
                        <> 
                        <Map
                            mapLib={maplibregl}
                            key={id}
                            id={id}
                            antialias={true}
                            onDrag={updateViewState}
                            onZoom={updateViewState}
                            onPitch={updateViewState}
                            onRotate={updateViewState}
                            initialViewState={{
                                latitude: currentView.lat,
                                longitude: currentView.lng,
                                zoom: currentView.zoom,
                                ...currentView
                            }}
                                mapboxAccessToken={
                                accessToken 
                                }
                                mapStyle={
                                    styleJSON
                                        ? styleJSON
                                        : "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                                }
                                >{controls?.navigation && 
                                <NavigationControl position="top-right"/>
                                }
                                {controls?.scale &&
                                <ScaleControl position="bottom-right"  />
                                }
                                {controls?.geolocate &&
                                <GeolocateControl position="top-right" />
                                }
                                {controls?.fullscreen &&
                                <FullscreenControl position="top-right" />
                                }
                        
                        <DeckGLOverlay
                                    interleaved={true}
                                    width={"100%"}
                                    height={"100%"}
                                    layers={[...mls,PlaceholderLayer]}
                                        />

                                
                                </Map>
                        {layers.map((l) => (
                            <MaticoMapLayer
                                key={l.name}
                                name={l.name}
                                source={l.source}
                                style={l.style}
                                onUpdate={(update)=>updateLayer(l.id, update)}
                                mapName={name}
                                beforeId={l.style.beforeId}
                            />
                        ))}
                        <MaticoLegendPane legends={mls.map( (l) => l.props._legend)} />
                        
                    </>
                )}
        </div>
    );
};
