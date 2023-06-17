import React from "react";
import _ from "lodash";
import { useMaticoSelector } from "Hooks/redux";
import { Text, Flex, View, TextField } from "@adobe/react-spectrum";
import { DatasetSelector } from "Components/DatasetSelector/DatasetSelector";
import { DatasetColumnSelector } from "Components/DatasetColumnSelector/DatasetColumnSelector";
import { usePane } from "Hooks/usePane";
import {
    DateTimeSliderPane,
    PaneRef
} from "@maticoapp/matico_types/spec";
import { CollapsibleSection } from "Components/CollapsibleSection";
import { PaneEditor } from "Components/Editors";

export interface PaneEditorProps {
    paneRef: PaneRef;
}

export const DateTimeSliderEditor: React.FC<PaneEditorProps> = ({
    paneRef
}) => {
    const { pane, updatePane, parent, updatePanePosition } = usePane(paneRef);

    const dateTimeSliderPane = pane as DateTimeSliderPane;

    const updateDataset = (dataset: string) => {
        updatePane({
            dataset: { ...dateTimeSliderPane.dataset, name: dataset },
            column: null
        });
    };

    const updateColumn = (column: string) => {
        updatePane({
            column: column
        });
    };

    const dataset = useMaticoSelector(
        (state) => state.datasets.datasets[dateTimeSliderPane.dataset.name]
    );

    if (!dateTimeSliderPane) {
        return (
            <View>
                <Text>Failed to find component</Text>
            </View>
        );
    }

    const columns = dataset?.columns;
    return (
        <Flex direction="column">
            <CollapsibleSection title="Basic" isOpen={true}>
                <TextField
                    width="100%"
                    label="name"
                    value={dateTimeSliderPane.name}
                    onChange={(name) => updatePane({ name })}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Layout" isOpen={true}>
                <PaneEditor
                    position={paneRef.position}
                    name={dateTimeSliderPane.name}
                    background={"white"}
                    onChange={(change) => updatePanePosition(change)}
                    parentLayout={parent.layout}
                    id={paneRef.id}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Data Source" isOpen={true}>
                <DatasetSelector
                    selectedDataset={dateTimeSliderPane.dataset.name}
                    onDatasetSelected={updateDataset}
                />
                {dataset && (
                    <DatasetColumnSelector
                        datasetName={dateTimeSliderPane.dataset.name}
                        selectedColumn={dateTimeSliderPane.column}
                        label="Column"
                        onColumnSelected={(column) => updateColumn(column.name)}
                    />
                )}
            </CollapsibleSection>
        </Flex>
    );
};
