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
import {usePane} from "Hooks/usePane";
import {HistogramPane, Labels, PaneRef} from "@maticoapp/matico_types/spec";

export interface PaneEditorProps {
    paneRef: PaneRef;
}

export const HistogramPaneEditor: React.FC<PaneEditorProps> = ({
   paneRef 
}) => {

    const {pane, updatePane, parent, updatePanePosition} = usePane(paneRef)

    const histogramPane = pane as HistogramPane;

    const updateLabels = (change: Partial<Labels>) => {
        const labels = histogramPane.labels ?? {} as Labels;
        updatePane({
            labels: { ...labels, ...change }
        });
    };

    const updateDataset = (dataset: string) => {
        updatePane({
            dataset: { ...histogramPane.dataset, name: dataset },
            column: null
        });
    };

    const updateColumn = (column: string) => {
        updatePane({
            column: column
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
              position={paneRef.position}
              name={histogramPane.name}
              background={"white"}
              onChange={(change) => updatePanePosition(change)}
              parentLayout={parent.layout} 
              id={paneRef.id}
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
