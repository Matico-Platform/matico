import React from "react";
import _ from "lodash";
import { useMaticoSelector } from "Hooks/redux";
import { Well, Text, Heading, Flex, View } from "@adobe/react-spectrum";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { DatasetColumnSelector } from "../Utils/DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
// import { ColorPicker } from "../Utils/ColorPicker";
import { NumericVariableEditor } from "../Utils/NumericVariableEditor";
import { ColorVariableEditor } from "../Utils/ColorVariableEditor";
import { DatasetSummary } from "Datasets/Dataset";
import { LabelEditor } from "../Utils/LabelEditor";
import { TwoUpCollapsableGrid } from "../Utils/TwoUpCollapsableGrid";
import { usePane } from "Hooks/usePane";
import { Labels, PaneRef, ScatterplotPane } from "@maticoapp/matico_types/spec";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";

export interface PaneEditorProps {
    paneRef: PaneRef;
}

export const ScatterplotPaneEditor: React.FC<PaneEditorProps> = ({
    paneRef
}) => {
    const { pane, updatePane, updatePanePosition, parent } = usePane(paneRef);
    const scatterplotPane = pane as ScatterplotPane;

    const updateLabels = (change: Partial<Labels>) => {
        updatePane({
            labels: { ...scatterplotPane?.labels, ...change }
        });
    };

    const updateDataset = (dataset: string) => {
        updatePane({
            dataset: { ...scatterplotPane?.dataset, name: dataset },
            xColumn: null,
            yColumn: null
        });
    };

    const dataset: DatasetSummary = useMaticoSelector(
        (state) => state.datasets.datasets[scatterplotPane?.dataset.name]
    );

    if (!scatterplotPane) {
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
                    name={scatterplotPane.name}
                    background={"white"}
                    onChange={(change) => updatePanePosition(change)}
                    parentLayout={parent.layout}
                    id={paneRef.id}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Data Source" isOpen={true}>
                <DatasetSelector
                    selectedDataset={scatterplotPane?.dataset.name}
                    onDatasetSelected={updateDataset}
                />
                {dataset ? (
                    <TwoUpCollapsableGrid>
                        <DatasetColumnSelector
                            label="X Column"
                            datasetName={scatterplotPane?.dataset.name}
                            selectedColumn={dataset?.columns?.find(
                                (c) => c.name === scatterplotPane.xColumn
                            )}
                            onColumnSelected={(xColumn) =>
                                updatePane({ xColumn: xColumn.name })
                            }
                        />
                        <DatasetColumnSelector
                            label="Y Column"
                            datasetName={scatterplotPane?.dataset.name}
                            selectedColumn={dataset?.columns?.find(
                                (c) => c.name === scatterplotPane.yColumn
                            )}
                            onColumnSelected={(yColumn) =>
                                updatePane({ yColumn: yColumn.name })
                            }
                        />
                    </TwoUpCollapsableGrid>
                ) : (
                    <Text>Select a dataset to see column options.</Text>
                )}
            </CollapsibleSection>
            <CollapsibleSection title="Chart Styles" isOpen={true}>
                <NumericVariableEditor
                    label="Dot Size"
                    datasetName={scatterplotPane?.dataset.name}
                    style={scatterplotPane.dotSize}
                    onUpdateStyle={(dotSize) => updatePane({ dotSize })}
                    minVal={0}
                    maxVal={100}
                />

                <ColorVariableEditor
                    label="Dot Color"
                    datasetName={scatterplotPane?.dataset.name}
                    style={scatterplotPane?.dotColor}
                    onUpdateStyle={(dotColor) => updatePane({ dotColor })}
                />
                <LabelEditor
                    labels={scatterplotPane?.labels}
                    onUpdateLabels={updateLabels}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Interaction" isOpen={true}>
                {dataset ? (
                    <>
                        <DatasetColumnSelector
                            label="X Column"
                            datasetName={scatterplotPane.dataset.name}
                            selectedColumn={dataset?.columns?.find(
                                (c) => c.name === scatterplotPane.xColumn
                            )}
                            onColumnSelected={(xColumn) =>
                                updatePane({ xColumn: xColumn.name })
                            }
                        />
                        <DatasetColumnSelector
                            label="Y Column"
                            datasetName={scatterplotPane.dataset.name}
                            selectedColumn={dataset?.columns?.find(
                                (c) => c.name === scatterplotPane.yColumn
                            )}
                            onColumnSelected={(yColumn) =>
                                updatePane({ yColumn: yColumn.name })
                            }
                        />
                    </>
                ) : (
                    <Text>Select a dataset to see interaction options.</Text>
                )}
            </CollapsibleSection>
        </View>
    );
};
