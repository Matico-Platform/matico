import React, { useState } from "react";
import _ from "lodash";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";

import { DatasetSelector } from "../Utils/DatasetSelector";
import { RowEntryMultiButton } from "../Utils/RowEntryMultiButton";
import { TwoUpCollapsableGrid } from "../Utils/TwoUpCollapsableGrid";
import { PaneEditor } from "./PaneEditor";
import { BaseMapSelector } from "../Utils/BaseMapSelector";
import { DefaultLayer } from "Components/MaticoEditor/Utils/PaneDetails";

import {
    Flex,
    ActionButton,
    Text,
    Item,
    Picker,
    Checkbox,
    DialogTrigger,
    TextField,
    View,
    ButtonGroup,
    Divider,
    CheckboxGroup
    // repeat,
} from "@adobe/react-spectrum";

import {
    MapPane,
    PaneRef,
    BaseMap,
    VarOr,
    View as MapView,
    Layer,
    Variable,
    MapControls
} from "@maticoapp/matico_types/spec";
import { usePane } from "Hooks/usePane";
import { setCurrentEditElement } from "Stores/MaticoSpecSlice";
import { v4 as uuidv4 } from "uuid";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";
import { DetailsEditor } from "./DetailsEditor";
import { GeoBoundsSelector } from "../EditorComponents/GeoBoundsSelector";
import { OptionsPopper } from "../EditorComponents/OptionsPopper";
import { NumericEditor } from "../EditorComponents/NumericEditor";
import { ParentSize } from "@visx/responsive";
import { AddLayerModal } from "../EditorComponents/AddLayerModal/AddLayerModal";

export interface PaneEditorProps {
    paneRef: PaneRef;
}

export const MapPaneEditor: React.FC<PaneEditorProps> = ({ paneRef }) => {
    const { pane, updatePane, updatePanePosition, removePane, parent } =
        usePane(paneRef);

    const mapPane = pane as MapPane;

    const mapPaneCurrentView = useMaticoSelector(
        (state) => state.variables.autoVariables[`${mapPane.id}_view`]
    );

    const dispatch = useMaticoDispatch();

    const updateBaseMap = (baseMap: BaseMap) => {
        updatePane({
            baseMap
        });
    };

    const updateView = (viewUpdate: Partial<VarOr<MapView>>) => {
        updatePane({
            view: { ...mapPane.view, ...viewUpdate }
        });
    };

    const updateSyncedView = (view: VarOr<MapView>) => {
        //@ts-ignore
        if (view.var) {
            updatePane({
                view: {
                    //@ts-ignore
                    var: `${view.var}_map_loc`,
                    //@ts-ignore
                    bind: view.bind
                } as Variable
            });
        }
    };

    const otherMapPanes = useMaticoSelector((state) =>
        Object.values(state.variables.autoVariables)
            .filter((variable) => variable.value.type === "mapview")
            .filter((variable) => variable.paneId !== paneRef.paneId)
            .map((variable) => ({
                ...variable,
                mapName: state.spec.spec.panes.find(
                    (p) => p.id === variable.paneId
                ).name
            }))
    );

    const syncedMapPaneView = useMaticoSelector((state) =>
        //@ts-ignore
        mapPane.view.var
            ? //@ts-ignore
              state.variables.autoVariables[mapPane.view.var]
            : null
    );

    const setViewFromMap = () => {
        updateView(mapPaneCurrentView?.value?.value);
    };

    if (!mapPane) {
        return (
            <View>
                {/* @ts-ignore */}
                <Text color="status-error">Failed to find component</Text>
            </View>
        );
    }

    const setLayerEdit = (id: string) => {
        dispatch(
            setCurrentEditElement({
                id,
                type: "layer"
            })
        );
    };

    const addLayer = (dataset: string, layerName: string) => {
        const newLayer: Layer = {
            ...DefaultLayer,
            source: { name: dataset, filters: [] },
            name: layerName,
            id: uuidv4()
        };
        updatePane({
            layers: [...mapPane.layers, newLayer]
        });
    };

    const startSyncing = (variableId: string) => {
        updatePane({
            ...mapPane,
            view: { varId: variableId, property: null, bind: true }
        });
    };

    const stopSyncing = () => {
        updatePane({
            ...mapPane,
            view: { ...syncedMapPaneView.value }
        });
    };

    const isSynced = syncedMapPaneView ? true : false;
    //@ts-ignore
    const isBound = mapPane?.view?.bind ? true : false;
    const mapView = isSynced ? syncedMapPaneView.value : mapPane.view;

    const toggleBind = () => {
        updateView({
            bind: !isBound
        });
    };

    return (
        <Flex direction="column">
            <CollapsibleSection title="Basic" isOpen={true}>
                <TextField
                    width="100%"
                    label="name"
                    value={mapPane.name}
                    onChange={(name) => updatePane({ name })}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Layout" isOpen={true}>
                <PaneEditor
                    position={paneRef.position}
                    name={mapPane.name}
                    background={"white"}
                    onChange={updatePanePosition}
                    parentLayout={parent.layout}
                    id={paneRef.id}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Map Bounds" isOpen={true}>
                <GeoBoundsSelector updateView={updateView} mapView={mapView} />
                {!isSynced && (
                    <ActionButton
                        width="100%"
                        onPress={setViewFromMap}
                        marginTop="size-50"
                    >
                        Set Map Bounds from Current View
                    </ActionButton>
                )}
                <OptionsPopper title="More Map Bounds Options">
                    <TwoUpCollapsableGrid>
                        <NumericEditor
                            label="Lat"
                            step={0.001}
                            value={mapView.lat}
                            isDisabled={isSynced}
                            onValueChange={(lat) => updateView({ lat })}
                        />
                        <NumericEditor
                            label="Lon"
                            step={0.001}
                            value={mapView.lng}
                            isDisabled={isSynced}
                            onValueChange={(lng) => updateView({ lng })}
                        />
                    </TwoUpCollapsableGrid>
                    <TwoUpCollapsableGrid>
                        <NumericEditor
                            label="Bearing"
                            step={1}
                            value={mapView.bearing}
                            isDisabled={isSynced}
                            onValueChange={(bearing) => updateView({ bearing })}
                        />
                        <NumericEditor
                            label="Pitch"
                            step={1}
                            value={mapView.pitch}
                            isDisabled={isSynced}
                            onValueChange={(pitch) => updateView({ pitch })}
                        />
                    </TwoUpCollapsableGrid>
                    <TwoUpCollapsableGrid>
                        <NumericEditor
                            label="Zoom"
                            step={1}
                            value={mapView.zoom}
                            isDisabled={isSynced}
                            onValueChange={(zoom) => updateView({ zoom })}
                        />
                    </TwoUpCollapsableGrid>
                </OptionsPopper>

                {otherMapPanes && otherMapPanes.length > 0 && (
                    <Picker
                        width="100%"
                        label="Sync to Another Map View"
                        labelPosition="side"
                        items={otherMapPanes}
                        selectedKey={mapPane?.view?.varId}
                        onSelectionChange={startSyncing}
                    >
                        {(pane) => <Item key={pane.id}>{pane.mapName}</Item>}
                    </Picker>
                )}
                {isSynced && (
                    <>
                        <Checkbox isSelected={isBound} onChange={toggleBind}>
                            Sync both maps
                        </Checkbox>
                        <ActionButton
                            width="100%"
                            onPress={stopSyncing}
                            marginTop="size-200"
                            marginBottom="size-200"
                            isDisabled
                        >
                            Stop Syncing Map View
                        </ActionButton>
                    </>
                )}
            </CollapsibleSection>
            <CollapsibleSection title="Layers" isOpen={true}>
                <AddLayerModal onAddLayer={addLayer} />
                <Flex marginBottom={"size-200"} direction="column" width="100%">
                    {/* @ts-ignore */}
                    {mapPane.layers.map((layer) => (
                        <RowEntryMultiButton
                            key={layer.name}
                            entryName={layer.name}
                            onSelect={() => setLayerEdit(layer.id)}
                            onRemove={() => {}}
                            onDuplicate={() => {}}
                            onRaise={() => {}}
                            onLower={() => {}}
                        />
                    ))}
                </Flex>
                <BaseMapSelector
                    baseMap={mapPane?.baseMap}
                    onChange={updateBaseMap}
                />
            </CollapsibleSection>
            {/*
            <CollapsibleSection title="Selection" isOpen={true}>
                <Checkbox
                    isSelected={mapPane.selectionoOtions?.selectionEnabled}
                    onChange={(val: boolean) =>
                        updatePane({
                            selectionOptions: {
                                ...mapPane.selectionOptions,
                                selectionEnabled: val
                            }
                        })
                    }
                >
                    Allow Selection
                </Checkbox>

                <Picker label="Selection Mode" selectedKey={mapPane.selectionOptions?.selectionMode} 
                    isDisabled={!mapPane.selectionOptions?.selectionEnabled}
                    onSelectionChange={(key)=> updatePane({ selectionOptions: { ...mapPane.selectionOptions, selectionMode: key }})}
                items={[{id:"rectangle", name:"Rectangle"}, {id:"lasso", name:"Lasso"}, {id:"polygon", name:"Polygon"}]}>
                    {(item)=><Item key={item.id}>{item.name}</Item>}
                </Picker>

            </CollapsibleSection>
            */}
            <CollapsibleSection title="Controls" isOpen={true}>
                <CheckboxGroup
                    value={Object.entries(mapPane.controls ?? {})
                        .filter(([label, selected]) => selected)
                        .map(([label, selected]) => label)}
                    //@ts-ignore
                    onChange={(update) =>
                        updatePane({
                            controls:
                                //@ts-ignore
                                update.reduce(
                                    (
                                        agg: MapControls,
                                        val: KeyOf<MapControls>
                                    ) => ({ ...agg, [val]: true }),
                                    {}
                                )
                        })
                    }
                    label="Map Controls"
                >
                    <Checkbox value="navigation">Navigation</Checkbox>
                    <Checkbox value="scale">Scale</Checkbox>
                    <Checkbox value="geolocate">Geolocate</Checkbox>
                    <Checkbox value="fullscreen">Full Screen</Checkbox>
                </CheckboxGroup>
            </CollapsibleSection>
        </Flex>
    );
};
