import React from "react";
import _ from "lodash";
import { useMaticoSelector } from "Hooks/redux";
import { Text, Flex, View, Divider, TextField } from "@adobe/react-spectrum";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { DatasetColumnSelector } from "../Utils/DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
import { ColorVariableEditor } from "../EditorComponents/ColorVariableEditor";
import { LabelEditor } from "../Utils/LabelEditor";
import { usePane } from "Hooks/usePane";
import { HistogramPane, Labels, PaneRef } from "@maticoapp/matico_types/spec";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";
import { SliderUnitSelector } from "../EditorComponents/SliderUnitSelector";

export interface PaneEditorProps {
    paneRef: PaneRef;
}

export const HistogramPaneEditor: React.FC<PaneEditorProps> = ({ paneRef }) => {
    const { pane, updatePane, parent, updatePanePosition } = usePane(paneRef);

    const histogramPane = pane as HistogramPane;

    const updateLabels = (change: Partial<Labels>) => {
        const labels = histogramPane.labels ?? ({} as Labels);
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

    const columns = dataset?.columns;
    return (
        <Flex direction="column">
            <CollapsibleSection title="Basic" isOpen={true}>
                <TextField
                    width="100%"
                    label="name"
                    value={histogramPane.name}
                    onChange={(name) => updatePane({ name })}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Layout" isOpen={true}>
                <PaneEditor
                    position={paneRef.position}
                    name={histogramPane.name}
                    background={"white"}
                    onChange={(change) => updatePanePosition(change)}
                    parentLayout={parent.layout}
                    id={paneRef.id}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Data Source" isOpen={true}>
                <DatasetSelector
                    selectedDataset={histogramPane.dataset.name}
                    onDatasetSelected={updateDataset}
                />
                {dataset && (
                    <DatasetColumnSelector
                        datasetName={histogramPane.dataset.name}
                        selectedColumn={histogramPane.column}
                        label="Column"
                        onColumnSelected={(column) => updateColumn(column.name)}
                    />
                )}
            </CollapsibleSection>
            {dataset && (
                <>
                    <CollapsibleSection title="Settings" isOpen={true}>
                        <Text>Max bins</Text>
                        <SliderUnitSelector
                            label="Number of bins"
                            sliderMin={2}
                            sliderMax={100}
                            value={histogramPane.maxbins}
                            onUpdateValue={(maxbins) => updatePane({ maxbins })}
                            sliderStep={1}
                        />

                        <ColorVariableEditor
                            label="Color"
                            style={histogramPane.color}
                            datasetName={histogramPane.dataset.name}
                            columns={columns}
                            onUpdateStyle={(color) => updatePane({ color })}
                        />
                    </CollapsibleSection>
                    <LabelEditor
                        labels={histogramPane.labels}
                        onUpdateLabels={updateLabels}
                    />
                </>
            )}
        </Flex>
    );
};
