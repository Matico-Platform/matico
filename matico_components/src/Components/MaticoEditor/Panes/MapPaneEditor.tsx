import React, { useState } from "react";
import _ from "lodash";
import { useMaticoSelector } from "Hooks/redux";

import { DatasetSelector } from "../Utils/DatasetSelector";
import { RowEntryMultiButton } from "../Utils/RowEntryMultiButton";
import { TwoUpCollapsableGrid } from "../Utils/TwoUpCollapsableGrid";
import { PaneEditor } from "./PaneEditor";
import { BaseMapSelector } from "../Utils/BaseMapSelector";
import { DefaultLayer, PaneDefaults } from "Components/MaticoEditor/PaneDefaults";
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
    ButtonGroup
    // repeat,
} from "@adobe/react-spectrum";
import {MapPane, PaneRef, BaseMap, VarOr, View as MapView, Layer, Variable} from "@maticoapp/matico_types/spec";
import {usePane} from "Hooks/usePane";
import {setCurrentEditElement} from "Stores/MaticoSpecSlice";
import {v4 as uuidv4} from 'uuid'

interface AddPaneModalProps {
    onAddLayer: (name: string, dataset: string) => void;
}

const AddPaneModal: React.FC<AddPaneModalProps> = ({ onAddLayer }) => {
    const [dataset, setDataset] = useState<string | null>(null);
    const [layerName, setLayerName] = useState<string>("New layer name");

    return (
        <DialogTrigger isDismissable type="popover">
            <ActionButton>Add</ActionButton>
            {(close) => (
                <Dialog>
                    <Heading>Add layer</Heading>
                    <Content>
                        <TextField
                            width="100%"
                            label="Layer name"
                            value={layerName}
                            onChange={setLayerName}
                        />
                        <DatasetSelector
                            selectedDataset={dataset}
                            onDatasetSelected={setDataset}
                        />
                    </Content>
                    <ButtonGroup>
                        <ActionButton
                            onPress={() => {
                                onAddLayer(dataset, layerName);
                                close();
                            }}
                        >
                            Add
                        </ActionButton>
                    </ButtonGroup>
                </Dialog>
            )}
        </DialogTrigger>
    );
};

export interface PaneEditorProps {
    paneRef: PaneRef;
}
export const MapPaneEditor: React.FC<PaneEditorProps> = ({ paneRef}) => {

    const {pane, updatePane, updatePanePosition, removePane, parent, }=  usePane(paneRef)

    const mapPane = pane as MapPane

    const mapPaneCurrentView = useMaticoSelector(
        (state) => state.variables.autoVariables[`${mapPane.name}_map_loc`]
    );


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
        if (view.var) {
            updatePane({
                view: {
                    var: `${view.var}_map_loc`,
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
                <Text>Failed to find component</Text>
            </View>
        );
    }


    const setLayerEdit = (index: number) => {
        setCurrentEditElement({
          type:"layer",
           
        });
    };

    const addLayer = (dataset: string, layerName: string) => {
        const newLayer : Layer= {
            ...DefaultLayer,
            source: { name: dataset, filters:[] },
            name: layerName,
            id : uuidv4()
        } ;
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
    const isBound = mapPane?.view?.bind ? true : false;
    const mapView = isSynced ? syncedMapPaneView.value : mapPane.view;

    const toggleBind = () => {
        updateView({
            bind: !isBound
        });
    };

    return (
        <Flex direction="column">
            <PaneEditor
              position={paneRef.position}
              name={mapPane.name}
              background={"white"}
              onChange={updatePanePosition}
              parentLayout={parent.layout} 
              id={paneRef.id}           
          />

            <Well>
                <Heading>
                    <Flex
                        direction="row"
                        justifyContent="space-between"
                        alignItems="end"
                    >
                        <Text>Map Bounds</Text>
                    </Flex>
                </Heading>
                <Flex direction="column">
                    <TwoUpCollapsableGrid>
                        <NumberField
                            width="100%"
                            label="lat"
                            step={0.001}
                            value={mapView.lat}
                            isDisabled={isSynced}
                            onChange={(lat) => updateView({ lat })}
                        />
                        <NumberField
                            width="100%"
                            label="lng"
                            step={0.001}
                            value={mapView.lng}
                            isDisabled={isSynced}
                            onChange={(lng) => updateView({ lng })}
                        />
                    </TwoUpCollapsableGrid>
                    <TwoUpCollapsableGrid>
                        <NumberField
                            width="100%"
                            label="bearing"
                            step={1}
                            value={mapView.bearing}
                            isDisabled={isSynced}
                            onChange={(bearing) => updateView({ bearing })}
                        />
                        <NumberField
                            width="100%"
                            label="pitch"
                            step={1}
                            value={mapView.pitch}
                            isDisabled={isSynced}
                            onChange={(pitch) => updateView({ pitch })}
                        />
                    </TwoUpCollapsableGrid>
                    <NumberField
                        width={{ L: "50%", M: "100%", S: "100%", base: "100%" }}
                        label="zoom"
                        step={1}
                        value={mapView.zoom}
                        isDisabled={isSynced}
                        onChange={(zoom) => updateView({ zoom })}
                    />
                    {!isSynced && (
                        <ActionButton
                            width="100%"
                            onPress={setViewFromMap}
                            marginTop="size-200"
                            marginBottom="size-200"
                        >
                            Set from current view
                        </ActionButton>
                    )}
                    {otherMapPanes && otherMapPanes.length > 0 && (
                        <Picker
                            width="100%"
                            label="Sync Map View"
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
                </Flex>
            </Well>
            <Well>
                <Heading>
                    <Flex
                        direction="row"
                        justifyContent="space-between"
                        alignItems="end"
                    >
                        <Text>Layers</Text>
                        <AddPaneModal onAddLayer={addLayer} />
                    </Flex>
                </Heading>
                <Flex marginBottom={"size-200"} direction="column">
                    {mapPane.layers.map((layer: Layer) => (
                        <RowEntryMultiButton
                          key={layer.name}
                          entryName={layer.name}
                          onSelect={() => setCurrentEditElement({type: "layer", id: layer.id})} 
                          onRemove={()=>{} } 
                          onDuplicate={()=>{}} 
                          onRaise={()=>{}} 
                          onLower={()=>{}}
                        />
                    ))}
                </Flex>
                <BaseMapSelector
                    baseMap={mapPane?.baseMap}
                    onChange={updateBaseMap}
                />
            </Well>
        </Flex>
    );
};
