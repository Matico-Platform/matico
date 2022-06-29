import React, { useState } from "react";
import _ from "lodash";
import { useMaticoSelector } from "Hooks/redux";

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
    Divider
    // repeat,
} from "@adobe/react-spectrum";

import {
    MapPane,
    PaneRef,
    BaseMap,
    VarOr,
    View as MapView,
    Layer,
    Variable
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

interface AddLayerModalProps {
    onAddLayer: (name: string, dataset: string) => void;
}

const AddLayerModal: React.FC<AddLayerModalProps> = ({ onAddLayer }) => {
    const [dataset, setDataset] = useState<string | null>(null);
    const [layerName, setLayerName] = useState<string>("New layer name");

    return (
        <ParentSize>
            {({ width }) => {
                return (
                    <DialogTrigger
                        isDismissable
                        type="popover"
                        containerPadding={0}
                        hideArrow
                    >
                        <ActionButton width="100%">Add Map Layer</ActionButton>
                        {(close) => (
                            <View
                                width={width}
                                backgroundColor="gray-75"
                                borderColor="informative"
                                borderWidth="thick"
                                UNSAFE_style={{
                                    boxShadow: "0px 0px 8px 4px rgba(0,0,0,0.5)"
                                }}
                            >
                                <Flex direction="column" margin="size-150">
                                    <Text>Add layer</Text>
                                    <Divider size="M" />
                                    <TextField
                                        width="100%"
                                        label="Layer name"
                                        labelPosition="side"
                                        value={layerName}
                                        onChange={setLayerName}
                                        marginY="size-50"
                                    />
                                    <DatasetSelector
                                        selectedDataset={dataset}
                                        onDatasetSelected={setDataset}
                                    />
                                    <ButtonGroup>
                                        <ActionButton
                                            type="submit"
                                            width="100%"
                                            marginY="size-50"
                                            onPress={() => {
                                                onAddLayer(dataset, layerName);
                                                close();
                                            }}
                                        >
                                            Add to Map
                                        </ActionButton>
                                    </ButtonGroup>
                                </Flex>
                            </View>
                        )}
                    </DialogTrigger>
                );
            }}
        </ParentSize>
    );
};

export interface PaneEditorProps {
    paneRef: PaneRef;
}

export const MapPaneEditor: React.FC<PaneEditorProps> = ({ paneRef }) => {
    const { pane, updatePane, updatePanePosition, removePane, parent } =
        usePane(paneRef);

    const mapPane = pane as MapPane;

    const mapPaneCurrentView = useMaticoSelector(
        (state) => state.variables.autoVariables[`${mapPane.name}_map_loc`]
    );

    const updateBaseMap = (baseMap: BaseMap) => {
        console.log("Updating base map", baseMap);
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
        Object.keys(state.variables.autoVariables)
            .filter((k) => k.includes("_map_loc"))
            .map((k) => ({ name: k.replace("_map_loc", "") }))
            .filter((k) => k.name !== mapPane.name)
    );

    const syncedMapPaneView = useMaticoSelector((state) =>
        //@ts-ignore
        mapPane.view.var
            ? //@ts-ignore
              state.variables.autoVariables[mapPane.view.var]
            : null
    );

    const setViewFromMap = () => {
        updateView(mapPaneCurrentView.value);
    };

    if (!mapPane) {
        return (
            <View>
                {/* @ts-ignore */}
                <Text color="status-error">Failed to find component</Text>
            </View>
        );
    }

    const setLayerEdit = (index: number) => {
        setCurrentEditElement({
            type: "layer"
        });
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

    const startSyncing = (pane: string) => {
        updatePane({
            ...mapPane,
            view: { var: `${pane}_map_loc`, bind: true }
        });
    };

    const stopSyncing = () => {
        updatePane({
            ...mapPane,
            view: { ...syncedMapPaneView.value, var: "", bind: null }
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
            <CollapsibleSection title="Details">
                <DetailsEditor pane={pane} updatePane={updatePane} />
            </CollapsibleSection>
            <CollapsibleSection title="Sizing" isOpen={true}>
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
                {otherMapPanes && otherMapPanes.length > 0 && (
                    <Picker
                        width="100%"
                        label="Sync to Another Map View"
                        labelPosition="side"
                        items={otherMapPanes}
                        selectedKey={
                            //@ts-ignore
                            mapPane?.view?.var &&
                            //@ts-ignore
                            mapPane.view.var.split("_map_loc")[0]
                        }
                        onSelectionChange={startSyncing}
                    >
                        {(pane) => <Item key={pane.name}>{pane.name}</Item>}
                    </Picker>
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
                            onSelect={() =>
                                setCurrentEditElement({
                                    type: "layer",
                                    id: layer.id
                                })
                            }
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
        </Flex>
    );
};
