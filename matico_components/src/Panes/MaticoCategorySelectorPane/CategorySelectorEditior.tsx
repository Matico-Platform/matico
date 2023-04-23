import React from "react";
import _ from "lodash";
import { useMaticoSelector } from "Hooks/redux";
import { Text, Flex, View, } from "@adobe/react-spectrum";
import { CategorySelectorPane, PaneRef } from "@maticoapp/matico_types/spec";
import { CollapsibleSection } from "Components/MaticoEditor/EditorComponents/CollapsibleSection";
import { DatasetSelector } from "Components/MaticoEditor/Utils/DatasetSelector";
import { DatasetColumnSelector } from "Components/MaticoEditor/Utils/DatasetColumnSelector";
import { useRecoilState } from "recoil";
import { panesAtomFamily } from "Stores/SpecAtoms";

export interface PaneEditorProps {
    paneRef: PaneRef;
}

export const CategorySelectorEditor: React.FC<PaneEditorProps> = ({
    paneRef
}) => {

    const [pane, updatePane] = useRecoilState(panesAtomFamily(paneRef.paneId))

    const categorySelectorPane = pane as CategorySelectorPane;

    const updateDataset = (dataset: string) => {
        updatePane({
            ...categorySelectorPane,
            dataset: { ...categorySelectorPane.dataset, name: dataset },
            column: null
        });
    };

    const updateColumn = (column: string) => {
        updatePane({
            ...categorySelectorPane,
            column: column
        });
    };

    const dataset = useMaticoSelector(
        (state) => state.datasets.datasets[categorySelectorPane.dataset?.name]
    );

    if (!categorySelectorPane) {
        return (
            <View>
                <Text>Failed to find component</Text>
            </View>
        );
    }

    const columns = dataset?.columns;
    return (
        <Flex direction="column">
            <CollapsibleSection title="Data Source" isOpen={true}>
                <DatasetSelector
                    selectedDataset={categorySelectorPane.dataset.name}
                    onDatasetSelected={updateDataset}
                />
                {dataset && (
                    <DatasetColumnSelector
                        datasetName={categorySelectorPane.dataset.name}
                        selectedColumn={categorySelectorPane.column}
                        label="Column"
                        onColumnSelected={(column) => updateColumn(column.name)}
                    />
                )}
            </CollapsibleSection>
        </Flex>
    );
};
