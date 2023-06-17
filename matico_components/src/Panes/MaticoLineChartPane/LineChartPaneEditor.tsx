import React from "react";
import _ from "lodash";
import { useMaticoSelector } from "Hooks/redux";
import { Text, TextField, View } from "@adobe/react-spectrum";
import { DatasetSelector } from "Components/DatasetSelector/DatasetSelector";
import { DatasetColumnSelector } from "Components/DatasetColumnSelector/DatasetColumnSelector";
import { DatasetSummary } from "Datasets/Dataset";
import { LabelEditor } from "Components/LabelEditor/LabelEditor";
import { usePane } from "Hooks/usePane";
import { Labels, PaneRef, LineChartPane } from "@maticoapp/matico_types/spec";
import { CollapsibleSection } from "Components/CollapsibleSection";
import { PaneEditor } from "Components/Editors";

export interface PaneEditorProps {
    paneRef: PaneRef;
}

export const LineChartPaneEditor: React.FC<PaneEditorProps> = ({ paneRef }) => {
    const { pane, updatePane, updatePanePosition, parent } = usePane(paneRef);
    const lineChartPane = pane as LineChartPane;

    const updateLabels = (change: Partial<Labels>) => {
        updatePane({
            labels: { ...lineChartPane?.labels, ...change }
        });
    };

    const updateDataset = (dataset: string) => {
        updatePane({
            dataset: { ...lineChartPane?.dataset, name: dataset },
            xColumn: null,
            yColumn: null
        });
    };

    const dataset: DatasetSummary = useMaticoSelector(
        (state) => state.datasets.datasets[lineChartPane?.dataset?.name]
    );

    if (!lineChartPane) {
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
                    value={lineChartPane.name}
                    onChange={(name) => updatePane({ name })}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Layout" isOpen={true}>
                <PaneEditor
                    position={paneRef.position}
                    name={lineChartPane.name}
                    background={"white"}
                    onChange={(change) => updatePanePosition(change)}
                    parentLayout={parent.layout}
                    id={paneRef.id}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Data Source" isOpen={true}>
                <DatasetSelector
                    selectedDataset={lineChartPane?.dataset?.name}
                    onDatasetSelected={updateDataset}
                />
                {dataset ? (
                    <>
                        <DatasetColumnSelector
                            label="X Column"
                            datasetName={lineChartPane?.dataset.name}
                            selectedColumn={lineChartPane.xColumn}
                            onColumnSelected={(xColumn) =>
                                updatePane({ xColumn: xColumn.name })
                            }
                        />
                        <DatasetColumnSelector
                            label="Y Column"
                            datasetName={lineChartPane?.dataset.name}
                            selectedColumn={lineChartPane.yColumn}
                            onColumnSelected={(yColumn) =>
                                updatePane({ yColumn: yColumn.name })
                            }
                        />
                    </>
                ) : (
                    <Text>Select a dataset to see column options.</Text>
                )}
            </CollapsibleSection>
            {dataset && (
                <>
                    {/* <CollapsibleSection title="Chart Styles" isOpen={true}>
                        <SliderVariableEditor
                            label="Line Width"
                            style={lineChartPane?.lineWidth}
                            datasetName={dataset?.name}
                            columns={dataset?.columns}
                            onUpdateValue={(lineWidth) => updatePane({ lineWidth })}
                            sliderMin={0}
                            sliderMax={10}
                        />

                        <ColorVariableEditor
                            label="Line Color"
                            datasetName={lineChartPane?.dataset?.name}
                            style={lineChartPane?.lineColor}
                            onUpdateStyle={(lineColor) =>
                                updatePane({ lineColor })
                            }
                            columns={dataset.columns}
                        />
                    </CollapsibleSection>
                    // <CollapsibleSection title="Interaction" isOpen={true}>
                    //     {dataset ? (
                    //         <>
                    //             <DatasetColumnSelector
                    //                 label="X Column"
                    //                 datasetName={lineChartPane.dataset?.name}
                    //                 selectedColumn={lineChartPane.xColumn}
                    //                 onColumnSelected={(xColumn) =>
                    //                     updatePane({ xColumn: xColumn.name })
                    //                 }
                    //             />
                    //             <DatasetColumnSelector
                    //                 label="Y Column"
                    //                 datasetName={lineChartPane.dataset?.name}
                    //                 selectedColumn={lineChartPane.yColumn}
                    //                 onColumnSelected={(yColumn) =>
                    //                     updatePane({ yColumn: yColumn.name })
                    //                 }
                    //             />
                    //         </>
                    //     ) : (
                    //         <Text>
                    //             Select a dataset to see interaction options.
                    //         </Text>
                    //     )}
                    // </CollapsibleSection> */}
                    <LabelEditor
                        labels={lineChartPane?.labels}
                        onUpdateLabels={updateLabels}
                    />
                </>
            )}
        </View>
    );
};
