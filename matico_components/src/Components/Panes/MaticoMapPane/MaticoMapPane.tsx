import React, { useState, useMemo, useRef } from "react";
import { View as MaticoView } from "@maticoapp/matico_spec";
import type { MaticoPaneInterface } from "../Pane";
import Map, { ScaleControl, GeolocateControl, NavigationControl, useControl} from "react-map-gl";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { MaticoMapLayer } from "./MaticoMapLayer";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { MaticoLegendPane } from "../MaticoLegendPane/MaticoLegendPane";
import { View } from "@adobe/react-spectrum";
import { Layer, MapControls} from "@maticoapp/matico_types/spec";
import {MapboxOverlayProps, MapboxOverlay} from "@deck.gl/mapbox/typed"
import maplibregl from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';



function DeckGLOverlay(props: MapboxOverlayProps){
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props)
  return null
}

const accessToken="pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiY2t1dThkcG1xM3p2ZzJ3bXhlaHFtdThlYiJ9.rmndXXXrC5HAbxg1Ok8XTg"

export interface MaticoMapPaneInterface extends MaticoPaneInterface {
    view: MaticoView;
    //TODO WE should properly type this from the @maticoapp/matico_spec library. Need to figure out the Typescript integration better or witx
    baseMap?: any;
    layers?: Array<any>;
    controls: MapControls
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
    controls
}) => {
    const [mapLayers, setMapLayers] = useState([]);
    const edit = useIsEditable();
    const mapRef = useRef();


    const updateLayer = (layer: Layer) => {
        if (!layer) return;
        setMapLayers((mapLayers) => {
            if (mapLayers.map((l) => l.id).includes(layer.id)) {
                return mapLayers.map((l) => (l.id === layer.id ? layer : l));
            } else {
                return [...mapLayers, layer];
            }
        });
    };

    const validMapLayers: any = useMemo(
        () =>
            layers
                ? layers
                      .map((layer) =>
                          mapLayers.find((ml) => ml.id === layer.name)
                      )
                      .filter((a) => a)
                : [],
        [mapLayers, JSON.stringify(layers)]
    );

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
    const updateViewState = (viewStateUpdate: any) => {
        const viewState = viewStateUpdate.viewState;
        updateView({
            lat: viewState.latitude,
            lng: viewState.longitude,
            zoom: viewState.zoom,
            pitch: viewState.pitch,
            bearing: viewState.bearing
        });
    };

    let styleJSON = null;

    if (baseMap) {
        if (baseMap.type === "named") {
            styleJSON = getNamedStyleJSON(baseMap.name, accessToken);
        } else if (baseMap.StyleJSON) {
            styleJSON = baseMap.StyleJSON;
        }
    }

    return (
        <View position="relative" overflow="hidden" width="100%" height="100%">
            {currentView && (
                <>
                    <Map
                        ref={mapRef}
                        onLoad={()=>{  console.log ( "Layers ", mapRef.current?.getStyle().layers.filter(l=>l.type==="symbol"))}
                        }
                        mapLib={maplibregl}
                        antialias={true}
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
                    
                    <DeckGLOverlay
                              interleaved={true}
                              width={"100%"}
                              height={"100%"}
                              onViewStateChange = {updateViewState} 
                              layers={[...layers]
                                  .sort((a, b) => (a.order > b.order ? 1 : -1))
                                  .map((l) =>
                                      validMapLayers.find((ml) => ml.id === l.name)
                                  )}
                                  />

                            
                            </Map>
                  
                    {layers.map((l) => (
                        <MaticoMapLayer
                            key={l.name}
                            name={l.name}
                            source={l.source}
                            style={l.style}
                            onUpdate={updateLayer}
                            mapName={name}
                            beforeId={l.style.beforeId}
                        />
                    ))}
                    <MaticoLegendPane layers={validMapLayers} />
                    
                </>
            )}
        </View>
    );
};
