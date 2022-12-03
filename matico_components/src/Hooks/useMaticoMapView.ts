import { View } from "@maticoapp/matico_types/spec";
import { values } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useAutoVariable } from "./useAutoVariable";

interface UseMaticoMapViewProps {
    view: View;
    id: string;
}

const DEFAULT_VIEW = {
    latitude: 0,
    longitude: 0,
    zoom: 1,
    pitch: 0,
    bearing: 0
};

export function useMaticoMapView({ view, id }: UseMaticoMapViewProps) {
    const isSyncedView = !!view?.varId;
    const isBound = !isSyncedView || !!view?.bind;
    const viewId = isSyncedView ? view.varId : `${id}_view`;
    const isUnboundSynced = isSyncedView && !isBound;

    const [localView, setLocalView] = useState({
        type: "mapView",
        value: {
            latitude: 0,
            longitude: 0,
            zoom: 0,
            bearing: 0,
            pitch: 0
        }
    });

    const [stateView, updateView] = useAutoVariable({
        variable: {
            name: "CurrentMapView",
            id: viewId,
            paneId: id,
            value: {
                type: "mapview",
                value: view?.lat
                    ? view
                    : view?.value?.lat
                    ? view.value
                    : undefined
            }
        },
        bind: isBound
    });

    const updateViewState = useCallback(
        (viewStateUpdate: any) => {
            const {
                viewState: { latitude, longitude, zoom, pitch, bearing }
            } = viewStateUpdate;
            if (latitude === undefined) return;

            if (isBound) {
                //@ts-ignore not 100% sure what the type issue here is, seems to thing it can be either a Variable or an update function for a variable.
                updateView({
                    type: "mapview",
                    value: {
                        lat: latitude,
                        lng: longitude,
                        zoom: zoom,
                        pitch: pitch,
                        bearing: bearing
                    }
                });
            } else {
                setLocalView({
                    type: "mapview",
                    value: {
                        latitude,
                        longitude,
                        zoom,
                        pitch,
                        bearing
                    }
                });
            }
        },
        [isBound, isSyncedView, viewId]
    );

    useEffect(() => {
        if (isUnboundSynced && stateView?.value?.lat !== undefined) {
            setLocalView({
                type: "mapview",
                value: {
                    latitude: stateView.value.lat,
                    longitude: stateView.value.lng,
                    zoom: stateView.value.zoom,
                    bearing: stateView.value.bearing,
                    pitch: stateView.value.pitch
                }
            });
        }
    }, [isUnboundSynced && JSON.stringify(stateView)]);

    let currentView = {
        type: "placeholderView",
        value: DEFAULT_VIEW
    };

    if (isUnboundSynced) {
        currentView = localView;
    } else if (
        stateView?.type === "mapview" &&
        stateView?.value?.lat !== undefined
    ) {
        currentView = {
            type: stateView.type,
            value: {
                latitude: stateView.value.lat,
                longitude: stateView.value.lng,
                zoom: stateView.value.zoom,
                bearing: stateView.value.bearing,
                pitch: stateView.value.pitch
            }
        };
    }

    return {
        currentView,
        updateViewState,
        updateView
    };
}
