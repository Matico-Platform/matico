import React, { useState, useMemo } from "react";
import { View as MaticoView } from "@maticoapp/matico_spec";
import type { MaticoPaneInterface } from "../Pane";
import DeckGL from "@deck.gl/react";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { MaticoMapLayer } from "./MaticoMapLayer";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { MaticoLegendPane } from "../MaticoLegendPane/MaticoLegendPane";
import { View } from "@adobe/react-spectrum";
import { MaticoSelectionLayer } from "./MaticoSelectionLayer";
import {Map} from 'react-map-gl'
import { SelectionOptions, Layer } from "@maticoapp/matico_types/spec";

export interface MaticoMapPaneInterface extends MaticoPaneInterface {
    view: MaticoView;
    //TODO WE should properly type this from the @maticoapp/matico_spec library. Need to figure out the Typescript integration better or witx
    baseMap?: any;
    layers?: Array<any>;
    selectionOptions: SelectionOptions
}

function getNamedStyleJSON(style: string) {
    switch (style) {
        case "CartoDBPositron":
            return "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
        case "CartoDBVoyager":
            return "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
        case "CartoDBDarkMatter":
            return "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
        case "Light":
            return "mapbox://styles/mapbox/light-v10";
        case "Dark":
            return "mapbox://styles/mapbox/dark-v10";
        case "Satelite":
            return "mapbox://styles/mapbox/satellite-v9";
        case "Terrain":
            return "mapbox://styles/mapbox/outdoors-v11";
        case "Streets":
            return "mapbox://styles/mapbox/streets-v11";
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
    selectionOptions
}) => {
    const [mapLayers, setMapLayers] = useState([]);
    const edit = useIsEditable();

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

    console.log("Selection options ", selectionOptions )

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
            styleJSON = getNamedStyleJSON(baseMap.name);
        } else if (baseMap.StyleJSON) {
            styleJSON = baseMap.StyleJSON;
        }
    }


    let mls = ([...layers]
                            .sort((a, b) => (a.order > b.order ? 1 : -1))
                            .map((l) =>
                                validMapLayers.find((ml) => ml.id === l.name)
                            ))

    const selectionLayer = mapLayers.find(s=> s.id ==="selection") 
    if (selectionLayer){
      mls.push(selectionLayer) 
    }

    console.log("mls ",mls)

    return (
        <View position="relative" overflow="hidden" width="100%" height="100%">
            {currentView && (
                <>
                    <DeckGL
                        width={"100%"}
                        height={"100%"}
                        initialViewState={{
                            latitude: currentView.lat,
                            longitude: currentView.lng,
                            zoom: currentView.zoom,
                            ...currentView
                        }}
                        controller={true}
                        onViewStateChange={updateViewState}
                        layers={mls}
                    >
                        <Map
                            mapboxAccessToken={
                                "pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiY2t1dThkcG1xM3p2ZzJ3bXhlaHFtdThlYiJ9.rmndXXXrC5HAbxg1Ok8XTg"
                            }
                            mapStyle={
                                styleJSON
                                    ? styleJSON
                                    : "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                            }
                            style={{width:"100%", height:"100%"}}
                        />
                    </DeckGL>
                    {layers.map((l) => (
                        <MaticoMapLayer
                            key={l.name}
                            name={l.name}
                            source={l.source}
                            style={l.style}
                            onUpdate={updateLayer}
                            mapName={id}
                        />
                    ))}

                    <MaticoSelectionLayer
                        onUpdate={updateLayer}
                        selectionEnabled={selectionOptions.selectionEnabled}
                        selectionMode={selectionOptions.selectionMode}
                        mapName={id}
                    />
                    <MaticoLegendPane layers={validMapLayers} />
                </>
            )}
        </View>
    );
};
