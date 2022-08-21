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
    Divider,
    StatusLight
} from "@adobe/react-spectrum";
import { DatasetTransformStep, FilterStep } from "@maticoapp/matico_types/spec";
import { useDatasetTransform } from "Hooks/useDatasetTransform";
import React from "react";
import { DataTable } from "../DataTable/DataTable";
import Filter from "@spectrum-icons/workflow/Filter";
import Join from "@spectrum-icons/workflow/Merge";
import AggregateIcon from "@spectrum-icons/workflow/GraphBarHorizontal";
import Compute from "@spectrum-icons/workflow/Calculator";
import { DatasetSelector } from "Components/MaticoEditor/Utils/DatasetSelector";
import { CollapsibleSection } from "../CollapsibleSection";
import Delete from "@spectrum-icons/workflow/Delete";
import { useTransform } from "Hooks/useTransform";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { JoinStepEditor } from "./JoinStep";
import { AggregateStepEditor } from "./AggregateStep";
import { FilterStepEditor } from "./FilterStep";
import { AddTransformStepDialog } from "./AddTransformStep";
import { DatasetState } from "Datasets/Dataset";
import { DatasetStatusColors } from "Components/MaticoEditor/Panes/DatasetsEditor";

export interface DatasetTransformEditorProps {
    transformId: string;
    state: DatasetState;
}

const IconForStepType: Record<string, React.ReactNode> = {
    filter: <Filter />,
    aggregate: <AggregateIcon />,
    compute: <Compute />,
    join: <Join />
};

export const DatasetTransformDialog: React.FC<DatasetTransformEditorProps> = ({
    transformId,
    state
}) => {
    const { datasetTransform } = useDatasetTransform(transformId);
    return (
        <DialogTrigger isDismissable>
            <ActionButton isQuiet>
                <Flex
                    direction="row"
                    gap="small"
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Text>{datasetTransform.name} </Text>
                    <StatusLight variant={DatasetStatusColors[state]} />
                </Flex>
            </ActionButton>
            {(close) => (
                <Dialog width="90vw" height="90vh">
                    <Content>
                        <DatasetTransformEditor
                            state={state}
                            transformId={transformId}
                        />

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

    const transformResult = useTransform(datasetTransform);

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
                    <Heading>
                        <Flex
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text>Transform Steps</Text>

                            <AddTransformStepDialog
                                onAdd={(newStep) => addStep(newStep)}
                            />
                        </Flex>
                    </Heading>
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
                </Flex>
            </Flex>
            <Divider size="S" />
            <Flex direction="column">
                {transformResult && transformResult.state == "Loading" && (
                    <LoadingSpinner />
                )}

                {transformResult && transformResult.state == "Error" && (
                    <Text>
                        Failed to run transform{" "}
                        {JSON.stringify(transformResult.error)}
                    </Text>
                )}
                {transformResult && transformResult.state === "Done" && (
                    <DataTable data={transformResult.result} />
                )}
            </Flex>
        </Flex>
    );
};
