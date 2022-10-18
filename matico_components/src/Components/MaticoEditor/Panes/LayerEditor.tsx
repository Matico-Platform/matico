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
    TextField,
    TableView,
    TableHeader,
    Column,
    TableBody,
    Row,
    Cell,
    ActionButton,
    Text
} from "@adobe/react-spectrum";
import { ColorVariableEditor } from "Components/MaticoEditor/EditorComponents/ColorVariableEditor";
import { FilterEditor } from "../Utils/FilterEditor";
import { Filter } from "@maticoapp/matico_types/spec";
import { TwoUpCollapsableGrid } from "../Utils/TwoUpCollapsableGrid";
import { SliderVariableEditor } from "../EditorComponents/SliderVariableEditor";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";
import { SliderUnitSelector } from "../EditorComponents/SliderUnitSelector";
import { useLayer } from "Hooks/useLayer";
import { TooltipColumnSpec } from "Components/Panes/MaticoMapPane/MaticoMapTooltip";
import Add from "@spectrum-icons/workflow/Add";
import Delete from "@spectrum-icons/workflow/Delete";
import ChevronDown from "@spectrum-icons/workflow/ChevronDown";
import ChevronUp from "@spectrum-icons/workflow/ChevronUp";
export interface LayerEditorProps {
    mapId: string;
    layerId: string;
    otherLayers?: Array<string>;
}

const presetFormats = [
    {
        label: "Percent",
        formatter: ",%",
        icon: <>%</>
    },
    {
        label: "Currency",
        formatter: "$,.2f",
        icon: <>$</>
    }
];

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
    // console.log("columns", dataset?.columns);

    const { columns, geomType } = dataset ?? { columns: null, geomType: null };

    const { style, tooltipColumns } = layer;
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

    const updateTooltip = (tooltipColumns: Array<TooltipColumnSpec>) => {
        updateLayer({
            // @ts-ignore
            tooltipColumns
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

    const handleTooltipColumnChange = ({
        index,
        value,
        action
    }: {
        index?: number;
        value?: object;
        action: string;
    }) => {
        if (!tooltipColumns) {
            console.log("no tooltip columns");
            updateTooltip([
                {
                    column: dataset?.columns[0].name || "",
                    label: dataset?.columns[0].name || ""
                }
            ]);
            return;
        }
        let newTooltipCols = [...tooltipColumns];
        switch (action) {
            case "delete": {
                newTooltipCols.splice(index, 1);
                updateTooltip(newTooltipCols);
                break;
            }
            case "add": {
                newTooltipCols.push({
                    column: dataset?.columns[0].name || "",
                    label: dataset?.columns[0].name || ""
                });
                updateTooltip(newTooltipCols);
                break;
            }
            case "update": {
                newTooltipCols[index] = { ...newTooltipCols[index], ...value };
                updateTooltip(newTooltipCols);
                break;
            }
            case "reorder-up": {
                const temp = newTooltipCols[index];
                newTooltipCols[index] = newTooltipCols[index - 1];
                newTooltipCols[index - 1] = temp;
                updateTooltip(newTooltipCols);
                break;
            }
            case "reorder-down": {
                const temp = newTooltipCols[index];
                newTooltipCols[index] = newTooltipCols[index + 1];
                newTooltipCols[index + 1] = temp;
                updateTooltip(newTooltipCols);
                break;
            }
            default:
                break;
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
                    <CollapsibleSection title="Tooltip" isOpen={true}>
                        {(tooltipColumns || []).map(
                            (entry: TooltipColumnSpec, i: number) => (
                                <Flex
                                    direction="row"
                                    width={"100%"}
                                    key={`${entry.column}-${i}`}
                                >
                                    <View
                                        borderBottomColor="gray-300"
                                        paddingY="size-100"
                                        marginBottom={"size-100"}
                                        marginEnd="size-100"
                                    >
                                        <View
                                            marginBottom={"size-50"}
                                            width="100%"
                                        >
                                            <Picker
                                                width="100%"
                                                labelPosition="side"
                                                label="Data Column"
                                                selectedKey={entry.column}
                                                items={dataset?.columns || []}
                                                onSelectionChange={(column) =>
                                                    handleTooltipColumnChange({
                                                        index: i,
                                                        value: { column, label: column },
                                                        action: "update"
                                                    })
                                                }
                                            >
                                                {(item) => (
                                                    <Item key={item.name}>
                                                        {item.name}
                                                    </Item>
                                                )}
                                            </Picker>
                                        </View>
                                        <View marginBottom={"size-50"}>
                                            <TextField
                                                width="100%"
                                                labelPosition="side"
                                                label="Text Label"
                                                value={entry?.label || ""}
                                                onChange={(val) =>
                                                    handleTooltipColumnChange({
                                                        index: i,
                                                        value: { label: val },
                                                        action: "update"
                                                    })
                                                }
                                            />
                                        </View>
                                        <View marginBottom={"size-50"}>
                                            <Flex
                                                direction={"row"}
                                                gap={"size-100"}
                                                // alignItems="end"
                                            >
                                                <TextField
                                                    label="Format Value"
                                                    labelPosition="side"
                                                    value={
                                                        entry?.formatter || ""
                                                    }
                                                    onChange={(val) =>
                                                        handleTooltipColumnChange(
                                                            {
                                                                index: i,
                                                                value: {
                                                                    formatter:
                                                                        val
                                                                },
                                                                action: "update"
                                                            }
                                                        )
                                                    }
                                                />
                                                {presetFormats.map((entry) => (
                                                    <ActionButton
                                                        key={entry.formatter}
                                                        isQuiet
                                                        onPress={() =>
                                                            handleTooltipColumnChange(
                                                                {
                                                                    index: i,
                                                                    value: {
                                                                        formatter:
                                                                            entry.formatter
                                                                    },
                                                                    action: "update"
                                                                }
                                                            )
                                                        }
                                                        aria-label={`Use ${entry.label} formatter`}
                                                    >
                                                        {entry.icon}
                                                    </ActionButton>
                                                ))}
                                            </Flex>
                                        </View>
                                        <Flex direction="row">
                                            <ActionButton
                                                isQuiet
                                                onPress={() =>
                                                    handleTooltipColumnChange({
                                                        index: i,
                                                        action: "delete"
                                                    })
                                                }
                                                aria-label="Delete tooltip column"
                                            >
                                                <Delete />
                                            </ActionButton>
                                            <ActionButton
                                                isQuiet
                                                onPress={() =>
                                                    handleTooltipColumnChange({
                                                        index: i,
                                                        action: "reorder-up"
                                                    })
                                                }
                                                aria-label="Reorder up"
                                            >
                                                <ChevronUp />
                                            </ActionButton>
                                            <ActionButton
                                                isQuiet
                                                onPress={() =>
                                                    handleTooltipColumnChange({
                                                        index: i,
                                                        action: "reorder-down"
                                                    })
                                                }
                                                aria-label="Reorder Down"
                                            >
                                                <ChevronDown />
                                            </ActionButton>
                                        </Flex>
                                    </View>
                                </Flex>
                            )
                        )}
                        <ActionButton
                            onPress={() =>
                                handleTooltipColumnChange({ action: "add" })
                            }
                            isQuiet
                        >
                            <Add />
                            <Text>Add Tooltip Column</Text>
                        </ActionButton>
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
