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
    StatusLight,
    TabList,
    TabPanels,
    Tabs
} from "@adobe/react-spectrum";
import { DatasetTransformStep } from "@maticoapp/matico_types/spec";
import { useDatasetTransform } from "Hooks/useDatasetTransform";
import React, { useEffect } from "react";
import { DataTable } from "../DataTable/DataTable";
import Filter from "@spectrum-icons/workflow/Filter";
import Join from "@spectrum-icons/workflow/Merge";
import AggregateIcon from "@spectrum-icons/workflow/GraphBarHorizontal";
import ColumnIcon from "@spectrum-icons/workflow/ColumnSettings";
import Compute from "@spectrum-icons/workflow/Calculator";
import { DatasetSelector } from "Components/MaticoEditor/Utils/DatasetSelector";
import { CollapsibleSection } from "../CollapsibleSection";
import Delete from "@spectrum-icons/workflow/Delete";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { JoinStepEditor } from "./JoinStep";
import { AggregateStepEditor } from "./AggregateStep";
import { FilterStepEditor } from "./FilterStep";
import { AddTransformStepDialog } from "./AddTransformStep";
import { Column, DatasetState } from "Datasets/Dataset";
import { DatasetStatusColors } from "Components/MaticoEditor/Panes/DatasetsEditor";
import {
    useRequestData,
    useTransformDataWithSteps
} from "Hooks/useRequestData";
import { ColumnTransformStepEditor } from "./ColumnTransfomStepEditor";
import { TransformStepPreview } from "Datasets/DatasetTransformRunner";
import ChevronDoubleRight from "@spectrum-icons/workflow/ChevronDoubleRight";
import Add from "@spectrum-icons/workflow/Add";
import { OptionsPopper } from "../OptionsPopper";
import { colBasis } from "Utils/columnHelper";
import Data from "@spectrum-icons/workflow/Data";
import Maximize from "@spectrum-icons/workflow/Maximize";
import Minimize from "@spectrum-icons/workflow/Minimize";

export interface DatasetTransformEditorProps {
    transformId: string;
    state: DatasetState;
}

const IconForStepType: Record<string, React.ReactNode> = {
    filter: <Filter />,
    aggregate: <AggregateIcon />,
    compute: <Compute />,
    join: <Join />,
    columnTransform: <ColumnIcon />
};

export const DatasetTransformDialog: React.FC<DatasetTransformEditorProps> = ({
    transformId,
    state
}) => {
    const { datasetTransform, removeTransform } =
        useDatasetTransform(transformId);
    return (
        <View
            borderBottomColor={"gray-300"}
            borderBottomWidth="thin"
            padding={0}
            margin={0}
        >
            <Flex direction="row" width="100%">
                <DialogTrigger isDismissable>
                    <ActionButton isQuiet flexGrow={1}>
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
                <ActionButton isQuiet onPress={removeTransform}>
                    <Delete />
                </ActionButton>
            </Flex>
        </View>
    );
};

export interface TransformStepProps {
    step: DatasetTransformStep;
    onChange: (update: Partial<DatasetTransformStep>) => void;
    columns?: Array<Column>;
    onRemove: (stepId: string) => void;
    datasetId?: string;
}

export const TransformStep: React.FC<TransformStepProps> = ({
    step,
    datasetId,
    onChange,
    columns,
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
                    columns={columns}
                />
            );
        case "join":
            return (
                <JoinStepEditor
                    joinStep={step}
                    onChange={updateStep}
                    datasetId={datasetId}
                    columns={columns}
                />
            );
        case "aggregate":
            return (
                <AggregateStepEditor
                    step={step}
                    onChange={updateStep}
                    datasetId={datasetId}
                    columns={columns}
                />
            );
        case "columnTransform":
            return (
                <ColumnTransformStepEditor
                    step={step}
                    onChange={updateStep}
                    datasetId={datasetId}
                    columns={columns}
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

    const transformResult = useTransformDataWithSteps({
        datasetName: datasetTransform.name
    });

    const inputDataset = useRequestData({
        datasetName: datasetTransform.sourceId,
        limit: 10
    });
    const stepPreviews = transformResult?.steps ?? [];

    const [tab, setTab] = React.useState("input");
    const [expandedTable, setExpandedTable] = React.useState(false);

    let PreviewTabs = [];
    let PreviewTabList = [];

    PreviewTabList.push(<Item key={"input"}>Input Dataset &gt;</Item>);
    PreviewTabs.push(
        <Item key={"input"}>
            {inputDataset && inputDataset.state === "Done" && (
                <DataTable data={inputDataset.result} />
            )}
        </Item>
    );

    datasetTransform.steps.forEach((step, index: number) => {
        const stepPreview = stepPreviews ? stepPreviews[index] : null;
        PreviewTabs.push(
            <Item key={`step_${index}`}>
                {stepPreview && <DataTable data={stepPreviews[index].table} />}
            </Item>
        );
        PreviewTabList.push(
            <Item key={`step_${index}`}>
                {step.type} ({stepPreview?.noRows}) &gt;
            </Item>
        );
    });

    useEffect(() => {
        const tabId = tab === "input" ? "step_input" : tab;
        try {
            console.log(tabId, document.querySelector(`#${tabId}`));
            document.querySelector(`#${tabId}`)?.scrollIntoView();
        } catch {
            console.log("could not find tab");
            // ignore
        }
    }, [tab]);

    return (
        <View width="100%" height="100%" overflow="hidden">
            <Flex
                direction="column"
                gap={"size-150"}
                width="100%"
                height="100%"
            >
                {!expandedTable && (
                    <>
                        <Flex
                            direction="row"
                            gap={"size-300"}
                            alignItems="start"
                            flex={1}
                        >
                            <Flex
                                flex={"1 1 100%"}
                                direction="column"
                                position={"relative"}
                                UNSAFE_style={{ overflowX: "hidden" }}
                            >
                                {/* <Heading>
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
                    </Heading> */}
                                <View
                                    maxWidth={"100%"}
                                    overflow="auto auto"
                                    paddingEnd="size-500"
                                    position="relative"
                                >
                                    <Flex direction="row" gap="size-200">
                                        <View
                                            minWidth={"30vw"}
                                            maxWidth="350px"
                                            paddingEnd={"size-200"}
                                            borderEndColor={"gray-600"}
                                            id={`step_input`}
                                            marginEnd={"size-500"}
                                            borderEndWidth="thin"
                                            position="relative"
                                            height="40vh"
                                            overflow="visible auto"
                                        >
                                            <Flex
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                UNSAFE_style={{
                                                    textTransform: "capitalize"
                                                }}
                                            >
                                                <Flex
                                                    alignItems="center"
                                                    direction="row"
                                                >
                                                    <Data />
                                                    <Text marginStart="size-200">
                                                        Input Dataset
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                            <Flex
                                                direction="column"
                                                gap="size-100"
                                                marginTop="size-200"
                                            >
                                                <Text>
                                                    Add transform steps here.
                                                    Preview your data at each
                                                    step in the table below.
                                                </Text>
                                                <TextField
                                                    label="Transform Name"
                                                    width="100%"
                                                    value={
                                                        datasetTransform.name
                                                    }
                                                    onChange={(name) =>
                                                        updateDatasetTransform({
                                                            name
                                                        })
                                                    }
                                                />
                                                <TextArea
                                                    label="Transform Description"
                                                    width="100%"
                                                    value={
                                                        datasetTransform.description
                                                    }
                                                    onChange={(description) =>
                                                        updateDatasetTransform({
                                                            description
                                                        })
                                                    }
                                                />
                                                <DatasetSelector
                                                    label="Base Dataset"
                                                    labelPosition="top"
                                                    selectedDataset={
                                                        datasetTransform.sourceId
                                                    }
                                                    onDatasetSelected={(
                                                        dataset
                                                    ) => {
                                                        updateDatasetTransform({
                                                            sourceId: dataset
                                                        });
                                                    }}
                                                />
                                            </Flex>
                                        </View>
                                        {datasetTransform.steps.map(
                                            (
                                                step: DatasetTransformStep,
                                                stepNo: number
                                            ) => (
                                                <View
                                                    minWidth={"30vw"}
                                                    maxWidth="350px"
                                                    paddingEnd={"size-200"}
                                                    borderEndColor={"gray-600"}
                                                    id={`step_${stepNo}`}
                                                    marginEnd={
                                                        stepNo ===
                                                        datasetTransform.steps
                                                            .length -
                                                            1
                                                            ? "size-500"
                                                            : "size-0"
                                                    }
                                                    borderEndWidth="thin"
                                                    position="relative"
                                                    height="40vh"
                                                    overflow="visible auto"
                                                >
                                                    <Flex
                                                        direction="row"
                                                        alignItems="center"
                                                        justifyContent="space-between"
                                                        UNSAFE_style={{
                                                            textTransform:
                                                                "capitalize"
                                                        }}
                                                    >
                                                        <Flex
                                                            alignItems="center"
                                                            direction="row"
                                                            flexBasis={colBasis(
                                                                7 / 8
                                                            )}
                                                        >
                                                            {
                                                                IconForStepType[
                                                                    step.type
                                                                ]
                                                            }
                                                            <Text marginStart="size-200">
                                                                {step?.type}
                                                            </Text>
                                                        </Flex>
                                                        <ActionButton
                                                            flexBasis={colBasis(
                                                                1 / 8
                                                            )}
                                                            isQuiet
                                                            onPress={() =>
                                                                removeStep(
                                                                    step.id
                                                                )
                                                            }
                                                        >
                                                            <Delete />
                                                        </ActionButton>
                                                    </Flex>
                                                    <TransformStep
                                                        key={step.id}
                                                        step={step}
                                                        columns={
                                                            stepNo === 0
                                                                ? null
                                                                : stepPreviews
                                                                ? stepPreviews?.[
                                                                      stepNo - 1
                                                                  ]?.columns
                                                                : null
                                                        }
                                                        onChange={updateStep}
                                                        onRemove={removeStep}
                                                        datasetId={
                                                            datasetTransform.sourceId
                                                        }
                                                    />
                                                    {/* {stepNo <
                                            datasetTransform.steps.length -
                                                1 && (
                                            <View
                                                position="absolute"
                                                left="100%"
                                                top="50%"
                                                UNSAFE_style={{
                                                    transform:
                                                        "translate(-50%, -50%)",
                                                    borderRadius: "2em"
                                                }}
                                                backgroundColor={"gray-50"}
                                                padding="size-100"
                                            >
                                                <ChevronDoubleRight size="S" />
                                            </View>
                                        )} */}
                                                </View>
                                            )
                                        )}
                                    </Flex>
                                </View>

                                <View
                                    position={"absolute"}
                                    left="100%"
                                    bottom="50%"
                                    backgroundColor="positive"
                                    UNSAFE_style={{
                                        transform: "translate(-100%, -50%)"
                                    }}
                                >
                                    <AddTransformStepDialog
                                        onAdd={(newStep) => addStep(newStep)}
                                        useIcon
                                    />
                                </View>
                            </Flex>
                        </Flex>
                        <Divider size="S" />
                    </>
                )}
                <Flex direction="column" position="relative">
                    {transformResult && transformResult.state == "Loading" && (
                        <LoadingSpinner />
                    )}

                    {transformResult && transformResult.state == "Error" && (
                        <Text>
                            Failed to run transform{" "}
                            {JSON.stringify(transformResult.error)}
                        </Text>
                    )}
                    <Tabs
                        selectedKey={tab}
                        // @ts-ignore
                        onSelectionChange={setTab}
                    >
                        <TabList>{PreviewTabList}</TabList>
                        <TabPanels>{PreviewTabs}</TabPanels>
                    </Tabs>

                    <ActionButton
                        position={"absolute"}
                        right="0px"
                        aria-label="Expand table"
                        onPress={() => {
                            setExpandedTable((prev) => !prev);
                        }}
                    >
                        {expandedTable ? <Minimize /> : <Maximize />}
                    </ActionButton>
                </Flex>
            </Flex>
        </View>
    );
};
