import React, { useState } from "react";
import _ from "lodash";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { DatasetColumnSelector } from "../Utils/DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
import { SectionHeading } from "../Utils/Utils";
import { Text, View } from "@adobe/react-spectrum";
import { usePane } from "Hooks/usePane";
import { PaneRef } from "@maticoapp/matico_types/spec";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";
import { PieChartPane } from "@maticoapp/matico_types/spec";

export interface PaneEditorProps {
    paneRef: PaneRef;
}

export const PieChartPaneEditor: React.FC<PaneEditorProps> = ({ paneRef }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { id, position } = paneRef;
    const { pane, updatePane, parent, updatePanePosition } = usePane(paneRef);

    const pieChartPane = pane as PieChartPane;

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
            <CollapsibleSection title="Sizing" isOpen={true}>
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
        </View>
    );
};
