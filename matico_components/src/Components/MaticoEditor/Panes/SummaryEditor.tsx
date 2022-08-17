import React from "react";
import {
    PaneRef,
    ScatterplotPane,
    Labels,
    SummaryItem,
    SummaryPane,
    SummaryStyle
} from "@maticoapp/matico_types/spec";
import { DatasetSummary } from "Datasets/Dataset";
import { useMaticoSelector } from "Hooks/redux";
import { usePane } from "Hooks/usePane";
import { PaneEditorProps } from "./MapPaneEditor";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";
import {
    TextField,
    View,
    Text,
    Flex,
    CheckboxGroup,
    Checkbox,
    ActionButton,
    Divider
} from "@adobe/react-spectrum";
import { PaneEditor } from "./PaneEditor";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { DatasetColumnSelector } from "../Utils/DatasetColumnSelector";

export interface SummaryPaneEditorProps {
    paneRef: PaneRef;
}

export const SummaryItemEditor: React.FC<{
    item: SummaryItem;
    onUpdate: (update: Partial<SummaryItem>) => void;
}> = ({ item, onUpdate }) => {
    return (
        <Flex direction="column" gap="size-200">
            <DatasetSelector
                labelPosition={"top"}
                selectedDataset={item.dataset}
                onDatasetSelected={(dataset) => onUpdate({ dataset })}
            />
            <DatasetColumnSelector
                labelPosition={"top"}
                selectedColumn={item.column}
                onColumnSelected={(column) => onUpdate({ column: column.name })}
            />
            <TextField
                width="100%"
                label="name"
                value={item.name}
                onChange={(name) => onUpdate({ name })}
                description={"What to label the summary"}
            />

            <CheckboxGroup
                value={item.summaryTypes}
                onChange={(summaryTypes) => onUpdate({ summaryTypes })}
                orientation="horizontal"
            >
                <Checkbox value="mean">Mean</Checkbox>
                <Checkbox value="median">Median</Checkbox>
                <Checkbox value="max">Max</Checkbox>
                <Checkbox value="min">Min</Checkbox>
                <Checkbox value="sum">Sum</Checkbox>
            </CheckboxGroup>
        </Flex>
    );
};
export const SummaryPaneEditor: React.FC<PaneEditorProps> = ({ paneRef }) => {
    const { pane, updatePane, updatePanePosition, parent } = usePane(paneRef);
    const summaryPane = pane as SummaryPane;

    if (!summaryPane) {
        return (
            <View>
                <Text>Failed to find component</Text>
            </View>
        );
    }

    const updateItem = (update: Partial<SummaryItem>, index: number) => {
        updatePane({
            ...summaryPane,
            summaryItems: summaryPane.summaryItems.map((item, i) =>
                i === index ? { ...item, ...update } : item
            )
        });
    };

    const removeItem = (index: number) => {
        updatePane({
            ...summaryPane,
            summaryItems: summaryPane.summaryItems.filter((_, i) => i !== index)
        });
    };

    const addItem = () => {
        updatePane({
            ...summaryPane,
            summaryItems: [
                ...summaryPane.summaryItems,
                {
                    dataset: null,
                    column: null,
                    summaryTypes: [],
                    groupbyColumns: [],
                    style: "compact",
                    name: null
                }
            ]
        });
    };

    return (
        <View>
            <CollapsibleSection title="Basic" isOpen={true}>
                <TextField
                    width="100%"
                    label="name"
                    value={summaryPane.name}
                    onChange={(name) => updatePane({ name })}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Layout" isOpen={true}>
                <PaneEditor
                    position={paneRef.position}
                    name={summaryPane.name}
                    background={"white"}
                    onChange={(change) => updatePanePosition(change)}
                    parentLayout={parent.layout}
                    id={paneRef.id}
                />
            </CollapsibleSection>

            <CollapsibleSection title="Summaries" isOpen={true}>
                <Flex direction="column" justifyContent="space-between" gap="size-300">
                    {summaryPane.summaryItems.map((item, index) => 
                                                  <>
                        <SummaryItemEditor
                            key={index}
                            item={item}
                            onUpdate={(update) => updateItem(update, index)}
                        />
                        <Divider size="S"/>
                    </>
                    )}
                    <ActionButton onPress={addItem}>Add Summary</ActionButton>
                </Flex>
            </CollapsibleSection>
        </View>
    );
};
