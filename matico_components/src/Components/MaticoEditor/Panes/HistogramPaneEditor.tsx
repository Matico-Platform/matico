import React from "react";
import _ from "lodash";
import { useMaticoSelector } from "Hooks/redux";
import { Well, Text, Heading, Flex, View } from "@adobe/react-spectrum";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { DatasetColumnSelector } from "../Utils/DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
import { NumericVariableEditor } from "../Utils/NumericVariableEditor";
import { ColorVariableEditor } from "../Utils/ColorVariableEditor";
import { LabelEditor } from "../Utils/LabelEditor";
import { TwoUpCollapsableGrid } from "../Utils/TwoUpCollapsableGrid";
import { useMaticoSpec } from "Hooks/useMaticoSpec";
import { useSpecActions } from "Hooks/useSpecActions";

export interface PaneEditorProps {
    editPath: string;
}

export const HistogramPaneEditor: React.FC<PaneEditorProps> = ({
    editPath
}) => {
    const [histogramPane, parentLayout] = useMaticoSpec(editPath);
    const { remove: deletePane, update: updatePane } = useSpecActions(
        editPath,
        "Histogram"
    );

    const updateLabels = (change: { [name: string]: string }) => {
        const labels = histogramPane.labels ?? {};
        updatePane({
            ...histogramPane,
            labels: { ...labels, ...change }
        });
    };

    const updateDataset = (dataset: string) => {
        updatePane({
            ...histogramPane,
            dataset: { ...histogramPane.dataset, name: dataset },
            column: null
        });
    };

    const updateColumn = (column: string) => {
        updatePane({
            ...histogramPane,
            column: column
        });
    };

    const updatePaneDetails = (change: any) => {
        updatePane({
            ...histogramPane,
            name: change.name,
            position: { ...histogramPane.position, ...change.position }
        });
    };

    const dataset = useMaticoSelector(
        (state) => state.datasets.datasets[histogramPane.dataset.name]
    );

    if (!histogramPane) {
        return (
            <View>
                <Text>Failed to find component</Text>
            </View>
        );
    }

    return (
        <Flex direction="column">
            <PaneEditor
                position={histogramPane.position}
                name={histogramPane.name}
                background={histogramPane.background}
                onChange={(change) => updatePaneDetails(change)}
                parentLayout={parentLayout}
            />
            <Well>
                <Heading>Data Source</Heading>
                <TwoUpCollapsableGrid>
                    <DatasetSelector
                        selectedDataset={histogramPane.dataset.name}
                        onDatasetSelected={updateDataset}
                    />
                    <DatasetColumnSelector
                        datasetName={histogramPane.dataset.name}
                        selectedColumn={histogramPane.column}
                        label="Column"
                        onColumnSelected={(column) => updateColumn(column.name)}
                    />
                </TwoUpCollapsableGrid>
            </Well>
            {dataset && (
                <>
                    <Well>
                        <Heading>Style</Heading>
                        <NumericVariableEditor
                            label="Number of bins"
                            minVal={2}
                            maxVal={100}
                            style={histogramPane.maxbins}
                            datasetName={histogramPane.dataset.name}
                            onUpdateStyle={(maxbins) => updatePane({ maxbins })}
                        />

                        <ColorVariableEditor
                            label="Color"
                            style={histogramPane.color}
                            datasetName={histogramPane.dataset.name}
                            onUpdateStyle={(color) => updatePane({ color })}
                        />
                    </Well>

                    <LabelEditor
                        labels={histogramPane.labels}
                        onUpdateLabels={updateLabels}
                    />
                </>
            )}
        </Flex>
    );
};
