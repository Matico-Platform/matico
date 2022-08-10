import {
    ActionButton,
    Content,
    Dialog,
    DialogTrigger,
    Flex,
    Heading,
    repeat,
    TextArea,
    TextField,
    View,
    Text,
    Picker,
    Item,
    Divider
} from "@adobe/react-spectrum";
import {
    DatasetTransform,
    DatasetTransformStep,
    FilterStep,
    AggregateStep,
    JoinStep,
    AggregationSummary
} from "@maticoapp/matico_types/spec";
import { DefaultGrid } from "Components/MaticoEditor/Utils/DefaultGrid";
import { useDatasetTransform } from "Hooks/useDatasetTransform";
import { transform } from "lodash";
import React from "react";
import { DataTable } from "../DataTable/DataTable";
import Filter from "@spectrum-icons/workflow/Filter";
import Join from "@spectrum-icons/workflow/Merge";
import AggregateIcon from "@spectrum-icons/workflow/GraphBarHorizontal";
import Compute from "@spectrum-icons/workflow/Calculator";
import {
    DatasetColumnSelector,
    DatasetColumnSelectorMulti
} from "Components/MaticoEditor/Utils/DatasetColumnSelector";
import { FilterEditor } from "Components/MaticoEditor/Utils/FilterEditor";
import { DatasetSelector } from "Components/MaticoEditor/Utils/DatasetSelector";
import { useRequestData } from "Hooks/useRequestData";
import { CollapsibleSection } from "../CollapsibleSection";
import Delete from "@spectrum-icons/workflow/Delete";

export interface DatasetTransformEditorProps {
    transformId: string;
}

const IconForStepType: Record<string, React.ReactNode> = {
    filter: <Filter />,
    aggregate: <AggregateIcon />,
    compute: <Compute />,
    join: <Join />
};

export const DatasetTransformDialog: React.FC<DatasetTransformEditorProps> = ({
    transformId
}) => {
    const { datasetTransform } = useDatasetTransform(transformId);
    return (
        <DialogTrigger type="fullscreen" isDismissable>
            <ActionButton> {datasetTransform.name}</ActionButton>
            {(close) => (
                <Dialog>
                    <Content>
                        <DatasetTransformEditor transformId={transformId} />
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};

export const AddTransformStepDialog: React.FC<{
    onAdd: (type: DatasetTransformStep) => void;
}> = ({ onAdd }) => {
    const addFilter = (close: () => void) => {
        onAdd({
            type: "filter",
            filters: []
        });
        close();
    };

    const addAggregate = (close: () => void) => {
        onAdd({
            type: "aggregate",
            aggregate: [],
            groupByColumns: []
        } as DatasetTransformStep);
        close();
    };

    const addCompute = (close: () => void) => {
        onAdd({
            type: "compute",
            url: null
        } as DatasetTransformStep);
        close();
    };

    const addJoin = (close: () => void) => {
        onAdd({
            type: "join",
            otherSourceId: null,
            joinType: "inner",
            joinColumnsLeft: [],
            joinColumnsRight: [],
            leftPrefix:"",
            rightPrefix:""
        } as DatasetTransformStep);
        close();
    };

    return (
        <DialogTrigger isDismissable type="popover">
            <ActionButton isQuiet>Add Transform step</ActionButton>
            {(close) => (
                <Dialog>
                    <Heading>Step Type</Heading>
                    <Content>
                        <DefaultGrid
                            columns={repeat(2, "1fr")}
                            columnGap={"size-150"}
                            rowGap={"size-150"}
                            autoRows="fit-content"
                            marginBottom="size-200"
                        >
                            <ActionButton onPress={() => addFilter(close)}>
                                <Filter />
                                Filter
                            </ActionButton>
                            <ActionButton onPress={() => addAggregate(close)}>
                                <AggregateIcon />
                                Aggregate
                            </ActionButton>
                            <ActionButton onPress={() => addCompute(close)}>
                                <Compute />
                                Compute
                            </ActionButton>
                            <ActionButton onPress={() => addJoin(close)}>
                                <Join />
                                Join
                            </ActionButton>
                        </DefaultGrid>
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};

export interface TransformStepProps {
    step: DatasetTransformStep;
    onChange: (update: Partial<DatasetTransformStep>) => void;
    onRemove: (stepId: string) => void;
    datasetId: string;
}

export const FilterStepEditor: React.FC<{
    filterStep: FilterStep;
    onChange: (update: Partial<FilterStep>) => void;
    datasetId: string;
}> = ({ filterStep, onChange, datasetId }) => {
    return (
        <Flex direction="column">
            <FilterEditor
                datasetName={datasetId}
                filters={filterStep.filters}
                onUpdateFilters={(update) => {
                    console.log("update is ", update);
                    onChange({ filters: update });
                }}
            />
        </Flex>
    );
};

export const JoinStepEditor: React.FC<{
    joinStep: JoinStep;
    onChange: (update: Partial<JoinStep>) => void;
    datasetId: string;
}> = ({ joinStep, onChange, datasetId }) => {

    return (
        <Flex direction="row" gap={"size-300"}>
            <Flex direction="column">
                <DatasetSelector
                    label="Dataset to join with"
                    labelPosition="top"
                    selectedDataset={joinStep.otherSourceId}
                    onDatasetSelected={(dataset) =>
                        onChange({ otherSourceId: dataset })
                    }
                />
                <Picker
                    label="Join Type"
                    onSelectionChange={(joinType) => onChange({ joinType })}
                    selectedKey={joinStep.joinType}
                    items={[
                        { id: "left", name: "Left" },
                        { id: "inner", name: "Inner" },
                        { id: "right", name: "Right" },
                        { id: "outer", name: "Outer" }
                    ]}
                >
                    {(item) => <Item key={item.id}>{item.name}</Item>}
                </Picker>
                <TextField label="Left Prefix" value={joinStep.leftPrefix} onChange={(leftPrefix)=> onChange({leftPrefix})} />
                <TextField label="Left Prefix" value={joinStep.leftPrefix} onChange={(leftPrefix)=> onChange({leftPrefix})} />
            </Flex>
            <Divider orientation="vertical" size="S" />
            <Flex direction="column" flex={1} gap="size-200">
                {joinStep.joinColumnsLeft.map(
                    (leftCol: string, index: number) => (
                        <Flex
                            key={index}
                            direction="row"
                            alignItems="end"
                            gap="size-300"
                            width="100%"
                        >
                            <DatasetColumnSelector
                                label="Left Join Column"
                                labelPosition="side"
                                datasetName={joinStep.otherSourceId}
                                selectedColumn={
                                    joinStep.joinColumnsLeft
                                        ? joinStep.joinColumnsLeft[index]
                                        : null
                                }
                                onColumnSelected={(column) => {
                                    onChange({
                                        joinColumnsLeft:
                                            joinStep.joinColumnsLeft.map(
                                                (jc, i) =>
                                                    i === index ? column.name : jc
                                            )
                                    });
                                }}
                            />
                            <DatasetColumnSelector
                                label="Right Join Column"
                                labelPosition="side"
                                datasetName={joinStep.otherSourceId}
                                selectedColumn={
                                    joinStep.joinColumnsRight
                                        ? joinStep.joinColumnsRight[index]
                                        : null
                                }
                                onColumnSelected={(column) => {
                                    onChange({
                                        joinColumnsRight:
                                            joinStep.joinColumnsRight.map(
                                                (jc, i) =>
                                                    i === index ? column.name : jc
                                            )
                                    });
                                }}
                            />
                            <ActionButton
                                onPress={() =>
                                    onChange({
                                        joinColumnsLeft:
                                            joinStep.joinColumnsLeft.filter(
                                                (_, i: number) => i !== index
                                            ),
                                        joinColumnsRight:
                                            joinStep.joinColumnsRight.filter(
                                                (_, i: number) => i !== index
                                            )
                                    })
                                }
                            >
                                {" "}
                                <Delete />{" "}
                            </ActionButton>
                        </Flex>
                    )
                )}
                <ActionButton
                    isQuiet
                    onPress={() =>
                        onChange({
                            joinColumnsLeft: [
                                ...joinStep.joinColumnsLeft,
                                null
                            ],
                            joinColumnsRight: [
                                ...joinStep.joinColumnsRight,
                                null
                            ]
                        })
                    }
                >
                    Add another column to join on
                </ActionButton>
            </Flex>
        </Flex>
    );
};

export const AggregateStepEditor: React.FC<{
    step: AggregateStep;
    datasetId: string;
    onChange: (update: Partial<AggregateStep>) => void;
}> = ({ step, datasetId, onChange }) => {
    const updateAggregate = (
        index: number,
        update: Partial<AggregationSummary>
    ) => {
        const newAggregate = step.aggregate.map(
            (a: AggregationSummary, i: number) =>
                i === index ? { ...a, ...update } : a
        );
        onChange({ aggregate: newAggregate });
    };

    return (
        <Flex direction="row" gap="size-200">
            <DatasetColumnSelectorMulti
                label="Columns to group by"
                datasetName={datasetId}
                selectedColumns={step.groupByColumns}
                onColumnsSelected={(groupByColumns) =>
                    onChange({ groupByColumns })
                }
            />
            <Divider orientation="vertical" size="S" />
            <Flex direction="column" gap="size-200">
                {step.aggregate.map(
                    (agg: AggregationSummary, index: number) => (
                        <Flex direction="row" gap="size-200">
                            <DatasetColumnSelector
                                datasetName={datasetId}
                                selectedColumn={agg.column}
                                onColumnSelected={(column) =>
                                    updateAggregate(index, { column : column.name })
                                }
                            />
                            <Picker
                                label="Aggregation Type"
                                labelPosition="side"
                                items={[
                                    { id: "min", label: "Min" },
                                    { id: "max", label: "Max" },
                                    { id: "mean", label: "Mean" },
                                    { id: "sum", label: "Sum" },
                                    { id: "median", label: "Median" }
                                ]}
                                onSelectionChange={(aggType) =>
                                    updateAggregate(index, { aggType })
                                }
                                selectedKey={agg.aggType}
                            >
                                {(item) => (
                                    <Item key={item.id}>{item.label}</Item>
                                )}
                            </Picker>
                            <TextField
                                labelPosition="side"
                                label="Rename result"
                                value={agg.rename}
                                onChange={(rename) =>
                                    updateAggregate(index, { rename })
                                }
                            />
                        </Flex>
                    )
                )}
                <ActionButton
                    onPress={() =>
                        onChange({
                            aggregate: [
                                ...step.aggregate,
                                { column: null, aggType: "sum", rename: null }
                            ]
                        })
                    }
                    isQuiet
                >
                    Add Aggregate
                </ActionButton>
            </Flex>
        </Flex>
    );
};

export const TransformStep: React.FC<TransformStepProps> = ({
    step,
    datasetId,
    onChange,
    onRemove
}) => {

    const updateStep = (update: Partial<DatasetTransformStep>) => {
        onChange({ ...step, ...update });
    };
    switch (step.type) {
        case "filter":
            return (
                <FilterStepEditor
                    filterStep={step}
                    onChange={updateStep}
                    datasetId={datasetId}
                />
            );
        case "join":
            return (
                <JoinStepEditor
                    joinStep={step}
                    onChange={updateStep}
                    datasetId={datasetId}
                />
            );
        case "aggregate":
            return (
                <AggregateStepEditor
                    step={step}
                    onChange={updateStep}
                    datasetId={datasetId}
                />
            );
        case "compute":
            return <Text>Compute not implemented</Text>;
        default:
            return <Text> Not Implemented</Text>;
    }
};

export const DatasetTransformEditor: React.FC<DatasetTransformEditorProps> = ({
    transformId
}) => {
    const {
        datasetTransform,
        updateDatasetTransform,
        updateStep,
        removeStep,
        addStep
    } = useDatasetTransform(transformId);

    const dataRequest = useRequestData({
        datasetName: datasetTransform.sourceId,
        filters: []
    });

    return (
        <Flex direction="column" gap={"size-300"} width="100%" height="100%">
            <Flex direction="row" gap={"size-300"} alignItems="start" flex={1}>
                <Flex direction="column">
                    <Heading>Details</Heading>
                    <TextField
                        label="Transform Name"
                        value={datasetTransform.name}
                        onChange={(name) => updateDatasetTransform({ name })}
                    />
                    <TextArea
                        label="Transform Description"
                        value={datasetTransform.description}
                        onChange={(description) =>
                            updateDatasetTransform({ description })
                        }
                    />
                    <DatasetSelector
                        label="Base Dataset"
                        labelPosition="top"
                        selectedDataset={datasetTransform.sourceId}
                        onDatasetSelected={(dataset) =>
                            updateDatasetTransform({ sourceId: dataset })
                        }
                    />
                </Flex>
                <Divider orientation="vertical" size="S" />
                <Flex flex={1} direction="column">
                    <Heading>Transform Steps</Heading>
                    <View overflow={{ y: "auto" }}>
                        {datasetTransform.steps.map(
                            (step: DatasetTransformStep) => (
                                <Flex width="100%" direction="row">
                                    <View flex={1}>
                                        <CollapsibleSection
                                            title={step.type}
                                            icon={IconForStepType[step.type]}
                                        >
                                            <TransformStep
                                                key={step.id}
                                                step={step}
                                                onChange={updateStep}
                                                onRemove={removeStep}
                                                datasetId={
                                                    datasetTransform.sourceId
                                                }
                                            />
                                        </CollapsibleSection>
                                    </View>
                                    <ActionButton
                                        isQuiet
                                        onPress={() => removeStep(step.id)}
                                    >
                                        <Delete />
                                    </ActionButton>
                                </Flex>
                            )
                        )}
                    </View>
                    <AddTransformStepDialog
                        onAdd={(newStep) => addStep(newStep)}
                    />
                </Flex>
            </Flex>
            <Divider size="S" />
            <Flex direction="column">
                {dataRequest && dataRequest.state === "Done" && (
                    <DataTable data={dataRequest.result} />
                )}
            </Flex>
        </Flex>
    );
};
