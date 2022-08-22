import React, { useState, useMemo, useRef } from "react";
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
import maplibregl from 'maplibre-gl';
import {v4 as uuid} from 'uuid';

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
    const edit = useIsEditable();
    const mapRef = useRef();


    const updateLayer = (id:string, layer: Layer) => {
        setMapLayers({...mapLayers, [id]:layer});
    };

    let mls = useMemo(()=> ([...layers]
        .sort((a, b) => (a.order > b.order ? 1 : -1))
        .map((l) =>
            mapLayers[l.id]
        )).filter(a=>a), [layers, mapLayers])

    const mapViewVariableId = useMemo(()=> uuid(),[])

    const [currentView, updateView] = useAutoVariable({
        variable:{
          name: "CurrentMapView",
          id: mapViewVariableId,
          paneId: id,
          value:{
            type:"mapview",
            value: view
          },
        },
        bind:true
    });

    const updateViewState = debounce((viewStateUpdate: any) => {
        const viewState = viewStateUpdate.viewState;
        //@ts-ignore not 100% sure what the type issue here is, seems to thing it can be either a Variable or an update function for a variable.
        updateView({
            type:"mapview",
            value:{
              lat: viewState.latitude,
              lng: viewState.longitude,
              zoom: viewState.zoom,
              pitch: viewState.pitch,
              bearing: viewState.bearing
            }
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


    // const selectionLayer = mapLayers.find(s=> s.id ==="selection") 
    // if (selectionLayer){
    //     mls.push(selectionLayer) 
    // }

    return (
        <View key={id} position="relative" overflow="hidden" width="100%" height="100%">
            {currentView && currentView.type === "mapview" && (
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
                            latitude: currentView.value.lat,
                            longitude: currentView.value.lng,
                            zoom: currentView.value.zoom,
                            bearing: currentView.value.bearing,
                            pitch: currentView.value.pitch,

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
                                layers={mls}
                                    />

                            
                            </Map>
                    {layers.map((l) => (
                        <MaticoMapLayer
                            key={l.name}
                            name={l.name}
                            source={l.source}
                            style={l.style}
                            onUpdate={(update)=>updateLayer(l.id, update)}
                            mapPaneId={id}
                            beforeId={l.style.beforeId}
                        />
                    ))}
                    <MaticoLegendPane legends={mls.map( (l) => l.props._legend)} />
                    
                </>
            )}
        </View>
    );
};
