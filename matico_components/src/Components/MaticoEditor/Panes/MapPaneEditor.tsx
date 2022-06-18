import React, { useState } from "react";
import _ from "lodash";
import { useMaticoSelector } from "Hooks/redux";

import { DatasetSelector } from "../Utils/DatasetSelector";
import { RowEntryMultiButton } from "../Utils/RowEntryMultiButton";
import { TwoUpCollapsableGrid } from "../Utils/TwoUpCollapsableGrid";
import { PaneEditor } from "./PaneEditor";
import { BaseMapSelector } from "../Utils/BaseMapSelector";
import { PaneDefaults } from "Components/MaticoEditor/PaneDefaults";
import {
    Flex,
    Heading,
    Well,
    NumberField,
    ActionButton,
    Text,
    Item,
    Picker,
    Checkbox,
    DialogTrigger,
    Dialog,
    Content,
    TextField,
    View,
    ButtonGroup,
    Divider
    // repeat,
} from "@adobe/react-spectrum";
import { useMaticoSpec } from "Hooks/useMaticoSpec";
import { useSpecActions } from "Hooks/useSpecActions";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";
import { DetailsEditor } from "./DetailsEditor";
import { GeoBoundsSelector } from "../EditorComponents/GeoBoundsSelector";
import { OptionsPopper } from "../EditorComponents/OptionsPopper";
import { NumericEditor } from "../EditorComponents/NumericEditor";
import { ParentSize } from "@visx/responsive";

interface AddPaneModalProps {
    onAddLayer: (name: string, dataset: string) => void;
}

const AddPaneModal: React.FC<AddPaneModalProps> = ({ onAddLayer }) => {
    const [dataset, setDataset] = useState<string | null>(null);
    const [layerName, setLayerName] = useState<string>("New layer name");

    return (
        <ParentSize>
            {({ width }) => {
                return <DialogTrigger 
                    isDismissable
                    type="popover" 
                    containerPadding={0}
                    hideArrow>
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
                            <Flex
                                direction="column"
                                margin="size-150"
                            >
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
            }}
        </ParentSize>
    );
};

export interface PaneEditorProps {
    editPath: string;
}
export const MapPaneEditor: React.FC<PaneEditorProps> = ({ editPath }) => {
    const [mapPane, parentLayout] = useMaticoSpec(editPath);

    const {
        remove: deletePane,
        update: updatePane,
        setEditPath
    } = useSpecActions(editPath, "Map");
    const mapPaneCurrentView = useMaticoSelector(
        (state) => state.variables.autoVariables[`${mapPane.name}_map_loc`]
    );

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [bindBothWays, setBindBothWays] = useState(false);

    const updatePaneDetails = (change: any) => {
        updatePane({
            ...mapPane,
            name: change.name,
            position: { ...mapPane.position, ...change.position }
        });
    };

    const updateBaseMap = (basemap: any) => {
        updatePane({
            ...mapPane,
            base_map: {
                Named: basemap
            }
        });
    };

    const updateView = (viewUpdate: any) => {
        updatePane({
            ...mapPane,
            view: { ...mapPane.view, ...viewUpdate }
        });
    };

    // @ts-ignore
    const updateSyncedView = (view) => {
        if (view.var) {
            updatePane({
                ...mapPane,
                view: {
                    var: `${view.var}_map_loc`,
                    bind: view.bind
                }
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
        mapPane.view.var
            ? state.variables.autoVariables[mapPane.view.var]
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
        setEditPath({
            editPath: `${editPath}.layers.${index}`,
            editType: "Layer"
        });
    };

    const addLayer = (dataset: string, layerName: string) => {
        const newLayer = {
            ...PaneDefaults.Layer,
            source: { name: dataset },
            name: layerName
        };
        updatePane({
            ...mapPane,
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
                <DetailsEditor
                    name={mapPane.name}
                    pane={mapPane}
                    updatePane={updatePane}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Sizing" isOpen={true}>
                <PaneEditor
                    position={mapPane.position}
                    name={mapPane.name}
                    background={mapPane.background}
                    onChange={updatePaneDetails}
                    parentLayout={parentLayout}
                />
            </CollapsibleSection>
            <CollapsibleSection
                title="Map Bounds"
                isOpen={true}
            >
                <GeoBoundsSelector
                    updateView={updateView}
                    mapView={mapView}
                />
                {!isSynced && (
                    <ActionButton
                        width="100%"
                        onPress={setViewFromMap}
                        marginTop="size-50"
                    >
                        Set Map Bounds from Current View
                    </ActionButton>
                )}
                <TextField
                    width="100%"
                    label="Geocoder"
                    labelPosition="side"
                    marginY={"size-50"}
                    value={"Coming soon..."}
                    onChange={(name: string) => { }}
                />
                {otherMapPanes && otherMapPanes.length > 0 && (
                    <Picker
                        width="100%"
                        label="Sync to Another Map View"
                        labelPosition="side"
                        items={otherMapPanes}
                        selectedKey={
                            mapPane?.view?.var &&
                            mapPane.view.var.split("_map_loc")[0]
                        }
                        onSelectionChange={startSyncing}
                    >
                        {(pane) => <Item key={pane.name}>{pane.name}</Item>}
                    </Picker>
                )}
                <OptionsPopper
                    title="More Map Bounds Options"
                >
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
                        <Checkbox
                            isSelected={isBound}
                            onChange={toggleBind}
                        >
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
            <CollapsibleSection title="Layers">
                <AddPaneModal onAddLayer={addLayer} />
                <Flex marginBottom={"size-200"} direction="column">
                    {/* @ts-ignore */}
                    {mapPane.layers.map((layer, index) => (
                        <RowEntryMultiButton
                            key={layer.name}
                            entryName={layer.name}
                            editPath={`${editPath}.layers.${index}`}
                            editType="Layer"
                        />
                    ))}
                </Flex>
                <BaseMapSelector
                    baseMap={mapPane?.base_map?.Named}
                    onChange={(baseMap) => updateBaseMap(baseMap)}
                />
            </CollapsibleSection>
        </Flex>
    );
};
