import React from "react";
import {
    Flex,
    Picker,
    Item,
    TextField,
    Divider,
    ActionButton
} from "@adobe/react-spectrum";
import { JoinStep } from "@maticoapp/matico_types/spec";
import Delete from "@spectrum-icons/workflow/Delete";
import { DatasetColumnSelector } from "Components/MaticoEditor/Utils/DatasetColumnSelector";
import { DatasetSelector } from "Components/MaticoEditor/Utils/DatasetSelector";
import { Column } from "Datasets/Dataset";
import { LabelGroup } from "../LabelGroup";
import { CollapsibleSection } from "../CollapsibleSection";
import { TwoUpCollapsableGrid } from "Components/MaticoEditor/Utils/TwoUpCollapsableGrid";


const generateJoinText = (join: JoinStep, index: number): string => {
    if (!join.joinColumnsLeft[index] || !join.joinColumnsRight[index]) {
        return 'Select join columns'
    }
    return `${join.joinColumnsLeft[index]}-${join.joinColumnsRight[index]}`;
}

export const JoinStepEditor: React.FC<{
    joinStep: JoinStep;
    onChange: (update: Partial<JoinStep>) => void;
    columns?: Array<Column>;
    datasetId?: string;
}> = ({ joinStep, onChange, datasetId, columns }) => {
    return (
        <Flex direction="column" gap={"size-100"}>
            <Flex direction="column" width="100%" gap="size-100">
                <DatasetSelector
                    label="Dataset to join with"
                    labelPosition="side"
                    selectedDataset={joinStep.otherSourceId}
                    onDatasetSelected={(dataset) =>
                        onChange({ otherSourceId: dataset })
                    }
                />
                <Picker
                    label="Join Type"
                    labelPosition="side"
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
                <TwoUpCollapsableGrid>
                    <TextField
                        label="Left Prefix"
                        labelPosition="side"
                        maxWidth="100%"
                        value={joinStep.leftPrefix}
                        onChange={(leftPrefix) => onChange({ leftPrefix })}
                    />
                    <TextField
                        label="Right Prefix"
                        labelPosition="side"
                        maxWidth="100%"
                        value={joinStep.rightPrefix}
                        onChange={(rightPrefix) => onChange({ rightPrefix })}
                    />
                </TwoUpCollapsableGrid>
            </Flex>
            <Divider orientation="vertical" size="S" />
            <Flex direction="column" flex={1} gap="size-100">
                {joinStep.joinColumnsLeft.map(
                    (leftCol: string, index: number) => (
                        <Flex direction="row" key={index}>
                            <CollapsibleSection title={generateJoinText(joinStep, index)}>
                                <Flex
                                    key={index}
                                    direction="column"
                                    alignItems="end"
                                    gap="size-100"
                                    width="100%"
                                >
                                    <TwoUpCollapsableGrid>
                                        <DatasetColumnSelector
                                            label="Left Join Column"
                                            labelPosition="top"
                                            datasetName={datasetId}
                                            columns={columns}
                                            selectedColumn={
                                                joinStep.joinColumnsLeft
                                                    ? joinStep.joinColumnsLeft[
                                                        index
                                                    ]
                                                    : null
                                            }
                                            onColumnSelected={(column) => {
                                                onChange({
                                                    joinColumnsLeft:
                                                        joinStep.joinColumnsLeft.map(
                                                            (jc, i) =>
                                                                i === index
                                                                    ? column.name
                                                                    : jc
                                                        )
                                                });
                                            }}
                                        />
                                        <DatasetColumnSelector
                                            label="Right Join Column"
                                            labelPosition="top"
                                            datasetName={joinStep.otherSourceId}
                                            selectedColumn={
                                                joinStep.joinColumnsRight
                                                    ? joinStep.joinColumnsRight[
                                                        index
                                                    ]
                                                    : null
                                            }
                                            onColumnSelected={(column) => {
                                                onChange({
                                                    joinColumnsRight:
                                                        joinStep.joinColumnsRight.map(
                                                            (jc, i) =>
                                                                i === index
                                                                    ? column.name
                                                                    : jc
                                                        )
                                                });
                                            }}
                                        />
                                    </TwoUpCollapsableGrid>
                                </Flex>
                            </CollapsibleSection>
                            <ActionButton
                                isQuiet
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
                    Add Column Join
                </ActionButton>
            </Flex>
        </Flex>
    );
};
