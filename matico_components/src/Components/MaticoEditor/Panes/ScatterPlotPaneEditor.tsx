import React from "react";
import _ from "lodash";
import { useMaticoSelector } from "Hooks/redux";
import { Text, TextField, View } from "@adobe/react-spectrum";
import { DatasetSelector } from "../Utils/DatasetSelector";
import { DatasetColumnSelector } from "../Utils/DatasetColumnSelector";
import { PaneEditor } from "./PaneEditor";
import { NumericVariableEditor } from "../Utils/NumericVariableEditor";
import { ColorVariableEditor } from "../EditorComponents/ColorVariableEditor";
import { DatasetSummary } from "Datasets/Dataset";
import { LabelEditor } from "../Utils/LabelEditor";
import { TwoUpCollapsableGrid } from "../Utils/TwoUpCollapsableGrid";
import { usePane } from "Hooks/usePane";
import { Labels, PaneRef, ScatterplotPane } from "@maticoapp/matico_types/spec";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";
import { SliderVariableEditor } from "../EditorComponents/SliderVariableEditor";

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
        (state) => state.datasets.datasets[scatterplotPane?.dataset?.name]
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
            <CollapsibleSection title="Basic" isOpen={true}>
                <TextField
                    width="100%"
                    label="name"
                    value={scatterplotPane.name}
                    onChange={(name) => updatePane({ name })}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Layout" isOpen={true}>
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
                    selectedDataset={scatterplotPane?.dataset?.name}
                    onDatasetSelected={updateDataset}
                />
                {dataset ? (
                    <>
                        <DatasetColumnSelector
                            label="X Column"
                            datasetName={scatterplotPane?.dataset.name}
                            selectedColumn={scatterplotPane.xColumn}
                            onColumnSelected={(xColumn) =>
                                updatePane({ xColumn: xColumn.name })
                            }
                        />
                        <DatasetColumnSelector
                            label="Y Column"
                            datasetName={scatterplotPane?.dataset.name}
                            selectedColumn={scatterplotPane.yColumn}
                            onColumnSelected={(yColumn) =>
                                updatePane({ yColumn: yColumn.name })
                            }
                        />
                    </>
                ) : (
                    <Text>Select a dataset to see column options.</Text>
                )}
            </CollapsibleSection>
               {dataset && 
            <>
            <CollapsibleSection title="Chart Styles" isOpen={true}>
                <SliderVariableEditor
                    label="Point Radius"
                    style={scatterplotPane?.dotSize}
                    datasetName={dataset?.name}
                    columns={dataset?.columns}
                    onUpdateValue={(dotSize) => updatePane({ dotSize })}
                    sliderMin={0}
                    sliderMax={10}
                />

                <ColorVariableEditor
                    label="Dot Color"
                    datasetName={scatterplotPane?.dataset?.name}
                    style={scatterplotPane?.dotColor}
                    onUpdateStyle={(dotColor) => updatePane({ dotColor })}
                    columns={dataset.columns}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Interaction" isOpen={true}>
                {dataset ? (
                    <>
                        <DatasetColumnSelector
                            label="X Column"
                            datasetName={scatterplotPane.dataset?.name}
                            selectedColumn={scatterplotPane.xColumn}
                            onColumnSelected={(xColumn) =>
                                updatePane({ xColumn: xColumn.name })
                            }
                        />
                        <DatasetColumnSelector
                            label="Y Column"
                            datasetName={scatterplotPane.dataset?.name}
                            selectedColumn={scatterplotPane.yColumn}
                            onColumnSelected={(yColumn) =>
                                updatePane({ yColumn: yColumn.name })
                            }
                        />
                    </>
                ) : (
                    <Text>Select a dataset to see interaction options.</Text>
                )}
            </CollapsibleSection>
            <LabelEditor
                labels={scatterplotPane?.labels}
                onUpdateLabels={updateLabels}
            />
          </>
              }
        </View>
    );
};
