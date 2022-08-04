
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
  Checkbox,
    Flex,
    Item,
    Picker,
    TextField,
    View,
    // repeat,
} from "@adobe/react-spectrum";

import {
    StaticMapPane,
    PaneRef,
    Layer,
} from "@maticoapp/matico_types/spec";
import { usePane } from "Hooks/usePane";
import { setCurrentEditElement } from "Stores/MaticoSpecSlice";
import { v4 as uuidv4 } from "uuid";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";
import {AddLayerModal} from "../EditorComponents/AddLayerModal/AddLayerModal";


export interface PaneEditorProps {
    paneRef: PaneRef;
}

export const StaticMapPaneEditor: React.FC<PaneEditorProps> = ({ paneRef }) => {
    const { pane, updatePane, updatePanePosition, removePane, parent } =
        usePane(paneRef);

    const mapPane = pane as StaticMapPane;

    const dispatch = useMaticoDispatch();


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
            <CollapsibleSection title="Map Settings" isOpen={true}>
              <Picker selectedKey={mapPane.projection} onSelectionChange={(projection)=> updatePane({projection})} items={[
                {id:"geoConicConformal", name:"Conic Conformal"},
                {id:"geoTransverseMercator", name: "Traverse Mercator"},
                {id:"geoNaturalEarth1", name: "Natural Earth"},
                {id:"geoConicEquidistant", name:"Conic Equidistant"},
                {id:"geoOrthographic", name :"Orthographic"},
                {id:"geoStereographic", name: "Stereographic"},
                {id:"geoMercator", name : "Mercator"},
                {id:"geoEquirectangular", name: "Equirectangular"}
              ]} >
                {(item)=><Item key={item.id}>{item.name}</Item>}
                </Picker>
                <Checkbox isSelected={mapPane.showGraticule} onChange={(val)=>updatePane({showGraticule:val})} >Show Graticule </Checkbox>
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
            </CollapsibleSection>
        </Flex>
    );
};
