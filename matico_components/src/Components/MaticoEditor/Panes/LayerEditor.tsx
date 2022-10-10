import React from "react";
import _ from "lodash";
import { useMaticoSelector } from "Hooks/redux";
import { GeomType } from "../../../Datasets/Dataset";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { DefaultLayer } from "Components/MaticoEditor/Utils/PaneDetails";
import {
    Flex,
    NumberField,
    Picker,
    Item,
    View,
    StatusLight,
    Checkbox,
    ComboBox,
    TextField
} from "@adobe/react-spectrum";
import { ColorVariableEditor } from "Components/MaticoEditor/EditorComponents/ColorVariableEditor";
import { FilterEditor } from "../Utils/FilterEditor";
import { Filter } from "@maticoapp/matico_types/spec";
import { TwoUpCollapsableGrid } from "../Utils/TwoUpCollapsableGrid";
import { SliderVariableEditor } from "../EditorComponents/SliderVariableEditor";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";
import { SliderUnitSelector } from "../EditorComponents/SliderUnitSelector";
import { useLayer } from "Hooks/useLayer";

export interface LayerEditorProps {
    mapId: string;
    layerId: string;
    otherLayers?: Array<string>;
}

export const LayerEditor: React.FC<LayerEditorProps> = ({
    mapId,
    layerId,
    otherLayers
}) => {
    const { layer, updateLayer, removeLayer, raiseLayer, lowerLayer } =
        useLayer(layerId, mapId);

    const defaults = DefaultLayer;
    const dataset = useMaticoSelector(
        (state) => state.datasets.datasets[layer.source.name]
    );

    const { columns, geomType } = dataset ?? { columns: null, geomType: null };

    const { style } = layer;
    const isPoint = geomType === GeomType.Point;

    const updateStyle = (property: string, value: any) => {
        updateLayer({
            style: { ...layer.style, [property]: value }
        });
    };

    if (!layer) {
        return (
            <View>
                <StatusLight variant="negative">
                    Failed to find component
                </StatusLight>
            </View>
        );
    }

    const updateFilters = (newFilters: Array<Filter>) => {
        updateLayer({
            source: {
                ...layer.source,
                filters: newFilters
            }
        });
    };

    const updateDataset = (dataset: string) => {
        updateLayer({
            source: { name: dataset, filters: [] },
            style: defaults.style
        });
    };

    const toggleDataDriven = (
        param: string,
        dataDriven: boolean,
        type: "color" | "number"
    ) => {
        const variable = columns.find((c) => c["type"] === "number");

        if (dataDriven) {
            const dataSpecs = {
                variable: variable?.name,
                domain: {
                    dataset: layer.source.name,
                    metric: {
                        type: "quantile",
                        bins: 5
                    },
                    column: variable?.name
                },
                range: "Peach.5"
            };
            updateLayer({
                style: {
                    ...layer.style,
                    [param]: dataSpecs
                }
            });
        } else {
            updateLayer({
                style: {
                    ...layer.style,
                    //@ts-ignore
                    [param]: defaults.style[param]
                }
            });
        }
    };
    return (
        <Flex direction="column">
            <CollapsibleSection title="Datasource" isOpen={true}>
                <DatasetSelector
                    selectedDataset={dataset?.name}
                    onDatasetSelected={updateDataset}
                />
            </CollapsibleSection>
            {dataset && (
                <>
                    {dataset?.geomType !== GeomType.Line && (
                        <CollapsibleSection title="Fill" isOpen={true}>
                            <ColorVariableEditor
                                label="Fill Color"
                                datasetName={dataset?.name}
                                columns={columns}
                                style={style.fillColor}
                                onUpdateStyle={(style) => {
                                    updateStyle("fillColor", style);
                                }}
                            />
                        </CollapsibleSection>
                    )}
                    {dataset?.geomType === GeomType.Point && (
                        <CollapsibleSection title="Radius" isOpen={true}>
                            <SliderVariableEditor
                                label="Point Radius"
                                style={style.size}
                                datasetName={dataset.name}
                                columns={columns}
                                onUpdateValue={(style) =>
                                    updateStyle("size", style)
                                }
                                sliderMin={0}
                                sliderMax={20}
                            />
                            <TwoUpCollapsableGrid
                                gridProps={{
                                    marginTop: "size-100"
                                }}
                            >
                                <NumberField
                                    value={style.radiusScale}
                                    label="Multiplier"
                                    labelPosition="side"
                                    arial-label="Point radius multiplier"
                                    maxValue={100000}
                                    minValue={0.001}
                                    onChange={(val) =>
                                        updateStyle("radiusScale", val)
                                    }
                                />
                                <Picker
                                    alignSelf={"flex-end"}
                                    label="Units"
                                    labelPosition="side"
                                    aria-label="Point radius units"
                                    selectedKey={style.radiusUnits}
                                    onSelectionChange={(units) =>
                                        updateStyle(
                                            "radiusUnits",
                                            units as string
                                        )
                                    }
                                >
                                    <Item key="meters">Meters</Item>
                                    <Item key="pixels">Pixels</Item>
                                </Picker>
                            </TwoUpCollapsableGrid>
                        </CollapsibleSection>
                    )}
                    <CollapsibleSection title="Line" isOpen={true}>
                        <ColorVariableEditor
                            label="Line Color"
                            style={style.lineColor}
                            datasetName={dataset?.name}
                            columns={columns}
                            onUpdateStyle={(style) =>
                                updateStyle("lineColor", style)
                            }
                        />
                        <SliderVariableEditor
                            label="Line Width"
                            style={style.lineWidth}
                            datasetName={dataset?.name}
                            columns={columns}
                            onUpdateValue={(style) =>
                                updateStyle("lineWidth", style)
                            }
                        />
                        {style.lineWidth !== -1 && (
                            <TwoUpCollapsableGrid
                                gridProps={{
                                    marginTop: "size-100"
                                }}
                            >
                                <NumberField
                                    value={style.lineWidthScale}
                                    label="Multiplier"
                                    aria-label="Line width multiplier"
                                    labelPosition="side"
                                    maxValue={10000}
                                    minValue={1}
                                    onChange={(val) =>
                                        updateStyle("lineWidthScale", val)
                                    }
                                />
                                <Picker
                                    label="Units"
                                    aria-label="Line width units"
                                    labelPosition="side"
                                    alignSelf={"flex-end"}
                                    selectedKey={style.lineUnits}
                                    onSelectionChange={(units) =>
                                        updateStyle("lineUnits", units)
                                    }
                                >
                                    <Item key="meters">Meters</Item>
                                    <Item key="pixels">Pixels</Item>
                                </Picker>
                            </TwoUpCollapsableGrid>
                        )}
                    </CollapsibleSection>
                    {dataset?.geomType === GeomType.Polygon && (
                        <CollapsibleSection title="3D" isOpen={true}>
                            <SliderVariableEditor
                                label="Elevation"
                                style={style.elevation}
                                datasetName={dataset?.name}
                                columns={columns}
                                onUpdateValue={(style) =>
                                    updateStyle("elevation", style)
                                }
                                sliderMin={0}
                                sliderMax={10000}
                            />
                            <TwoUpCollapsableGrid>
                                <NumberField
                                    value={style.elevationScale}
                                    width="100%"
                                    label="Elevation Multiplier"
                                    maxValue={100000}
                                    minValue={1}
                                    onChange={(val) =>
                                        updateStyle("elevationScale", val)
                                    }
                                />
                            </TwoUpCollapsableGrid>
                        </CollapsibleSection>
                    )}
                    <CollapsibleSection
                        title="Opacity and Visibility"
                        isOpen={true}
                    >
                        <TwoUpCollapsableGrid>
                            <SliderUnitSelector
                                label="Layer Opacity"
                                value={
                                    style.opacity === undefined
                                        ? 1
                                        : (style.opacity as number)
                                }
                                sliderMin={0}
                                sliderMax={1}
                                sliderStep={0.01}
                                onUpdateValue={(val) =>
                                    updateStyle("opacity", val)
                                }
                            />
                            <Checkbox
                                isSelected={
                                    style.visible === undefined
                                        ? true
                                        : style.visible
                                }
                                onChange={() =>
                                    updateStyle("visible", !style.visible)
                                }
                            >
                                Layer Visibility
                            </Checkbox>
                        </TwoUpCollapsableGrid>
                    </CollapsibleSection>
                    <CollapsibleSection title="Interleaving" isOpen={true}>
                        <TextField
                            label={"Before layer id"}
                            defaultValue={null}
                            value={style.beforeId}
                            onChange={(val) => updateStyle("beforeId", val)}
                        />
                    </CollapsibleSection>
                </>
            )}
        </Flex>
    );
};
