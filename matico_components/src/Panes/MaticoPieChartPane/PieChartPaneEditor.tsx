import React from "react";
import _ from "lodash";
import { DatasetSelector } from "Components/DatasetSelector/DatasetSelector";
import { DatasetColumnSelector } from "Components/DatasetColumnSelector/DatasetColumnSelector";
import { Text, TextField, View } from "@adobe/react-spectrum";
import { usePane } from "Hooks/usePane";
import { PaneRef, PieChartPane, Labels } from "@maticoapp/matico_types/spec";
import { CollapsibleSection } from "Components/CollapsibleSection";
import { LabelEditor } from "Components/LabelEditor/LabelEditor";
import { PaneEditor } from "Components/Editors";

export interface PaneEditorProps {
    paneRef: PaneRef;
}

export const PieChartPaneEditor: React.FC<PaneEditorProps> = ({ paneRef }) => {
    const { pane, updatePane, parent, updatePanePosition } = usePane(paneRef);

    const pieChartPane = pane as PieChartPane;

    const updateLabels = (change: Partial<Labels>) => {
        const labels = pieChartPane.labels ?? ({} as Labels);
        updatePane({
            labels: { ...labels, ...change }
        });
    };

    const updateDataset = (dataset: string) => {
        updatePane({
            dataset: { ...pieChartPane.dataset, name: dataset },
            column: null
        });
    };

    const updateColumn = (column: string) => {
        updatePane({
            column: column
        });
    };

    if (!pieChartPane) {
        return (
            <View>
                <Text>Failed to find component</Text>
            </View>
        );
    }

    return (
        <View>
            <CollapsibleSection title="Basic" isOpen={true}>
                <TextField
                    width="100%"
                    label="name"
                    value={pieChartPane.name}
                    onChange={(name) => updatePane({ name })}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Layout" isOpen={true}>
                <PaneEditor
                    position={paneRef.position}
                    name={pieChartPane.name}
                    background={"white"}
                    onChange={(change) => updatePanePosition(change)}
                    parentLayout={parent.layout}
                    id={paneRef.id}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Data Source and Column" isOpen={true}>
                <DatasetSelector
                    selectedDataset={pieChartPane.dataset.name}
                    onDatasetSelected={updateDataset}
                />
                <DatasetColumnSelector
                    datasetName={pieChartPane.dataset.name}
                    selectedColumn={pieChartPane.column}
                    label="Column"
                    onColumnSelected={(column) => updateColumn(column.name)}
                />
            </CollapsibleSection>
            <LabelEditor
                labels={pieChartPane.labels}
                onUpdateLabels={updateLabels}
            />
        </View>
    );
};
