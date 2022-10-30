import React from "react";
import {
    Flex,
    Item,
    TextField,
    Divider,
    ActionButton,
    Text,
    ActionGroup,
    View
} from "@adobe/react-spectrum";
// @ts-ignore
import { JoinStep } from "@maticoapp/matico_types/spec";
import Delete from "@spectrum-icons/workflow/Delete";
import { DatasetColumnSelector } from "Components/MaticoEditor/Utils/DatasetColumnSelector";
import { DatasetSelector } from "Components/MaticoEditor/Utils/DatasetSelector";
import { Column } from "Datasets/Dataset";
import { CollapsibleSection } from "../CollapsibleSection";
import { colBasis } from "Utils/columnHelper";

const generateJoinText = (join: JoinStep, index: number): string => {
    if (!join.joinColumnsLeft[index] || !join.joinColumnsRight[index]) {
        return "Select join columns";
    }
    return `${join.joinColumnsLeft[index]}-${join.joinColumnsRight[index]}`;
};

export const JoinStepEditor: React.FC<{
    joinStep: JoinStep;
    onChange: (update: Partial<JoinStep>) => void;
    columns?: Array<Column>;
    datasetId?: string;
}> = ({ joinStep, onChange, datasetId, columns }) => {
    return (
        <Flex direction="column" gap={"size-100"}>
            <Flex direction="column" width="100%" gap="size-100">
                <Flex direction="row" alignItems={"center"}>
                    <Text
                        id="dataset-selector-label"
                        flexBasis={colBasis(2 / 8)}
                    >
                        Join to
                    </Text>
                    <DatasetSelector
                        labeledBy="dataset-selector-label"
                        selectedDataset={joinStep.otherSourceId}
                        onDatasetSelected={(dataset) =>
                            onChange({ otherSourceId: dataset })
                        }
                        pickerStyle={{ flexBasis: colBasis(6 / 8) }}
                    />
                </Flex>
                <Flex direction="row" alignItems={"center"}>
                    <Text id="join-type-selector" flexBasis={colBasis(2 / 8)}>
                        Join Type
                    </Text>

                    <ActionGroup
                        aria-labeled-by="join-type-selector"
                        isEmphasized
                        flexBasis={colBasis(6 / 8)}
                        overflowMode="wrap"
                        selectionMode="single"
                        selectedKeys={[joinStep.joinType]}
                        items={[
                            { id: "left", name: "Left" },
                            { id: "inner", name: "Inner" },
                            { id: "right", name: "Right" },
                            { id: "outer", name: "Outer" }
                        ]}
                        onSelectionChange={(joinList) =>
                            onChange({ joinType: [...joinList][0] })
                        }
                    >
                        {(item) => <Item key={item.id}>{item.name}</Item>}
                    </ActionGroup>
                </Flex>
                <Flex direction="row" alignItems="center">
                    <Text id="left-prefix-label" flexBasis={colBasis(2 / 8)}>
                        Left prefix
                    </Text>
                    <TextField
                        maxWidth="100%"
                        flexBasis={colBasis(1.75 / 8)}
                        aria-labeled-by="left-prefix-label"
                        value={joinStep.leftPrefix}
                        onChange={(leftPrefix) => onChange({ leftPrefix })}
                    />
                    <View flexBasis={colBasis(0.5 / 8)}> </View>
                    <Text id="right-prefix-label" flexBasis={colBasis(2 / 8)}>
                        Right prefix
                    </Text>
                    <TextField
                        maxWidth="100%"
                        flexBasis={colBasis(1.75 / 8)}
                        aria-labeled-by="right-prefix-label"
                        value={joinStep.rightPrefix}
                        onChange={(rightPrefix) => onChange({ rightPrefix })}
                    />
                </Flex>
            </Flex>
            <Divider orientation="vertical" size="S" />
            <Flex direction="column" flex={1} gap="size-100">
                {joinStep.joinColumnsLeft.map(
                    (leftCol: string, index: number) => (
                        <Flex direction="row" key={index}>
                            <CollapsibleSection
                                title={generateJoinText(joinStep, index)}
                                outerStyle={{ flexBasis: colBasis(7 / 8) }}
                            >
                                <Flex
                                    key={index}
                                    direction="column"
                                    alignItems="end"
                                    gap="size-100"
                                    width="100%"
                                >
                                    <Flex
                                        direction="row"
                                        alignItems="center"
                                        width="100%"
                                    >
                                        <Text
                                            flexBasis={colBasis(2 / 7)}
                                            id="left-join-selector-label"
                                        >
                                            Left join column
                                        </Text>
                                        <DatasetColumnSelector
                                            labeledBy="left-join-selector-label"
                                            pickerStyle={{
                                                flexBasis: colBasis(5 / 7)
                                            }}
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
                                                            (
                                                                jc: string,
                                                                i: number
                                                            ) =>
                                                                i === index
                                                                    ? column.name
                                                                    : jc
                                                        )
                                                });
                                            }}
                                        />
                                    </Flex>

                                    <Flex
                                        direction="row"
                                        alignItems="center"
                                        width="100%"
                                    >
                                        <Text
                                            flexBasis={colBasis(2 / 7)}
                                            id="right-join-selector-label"
                                        >
                                            Right join column
                                        </Text>
                                        <DatasetColumnSelector
                                            labeledBy="right-join-selector-label"
                                            pickerStyle={{
                                                flexBasis: colBasis(5 / 7)
                                            }}
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
                                                            (
                                                                jc: string,
                                                                i: number
                                                            ) =>
                                                                i === index
                                                                    ? column.name
                                                                    : jc
                                                        )
                                                });
                                            }}
                                        />
                                    </Flex>
                                </Flex>
                            </CollapsibleSection>
                            <ActionButton
                                isQuiet
                                flexBasis={colBasis(1 / 8)}
                                onPress={() =>
                                    onChange({
                                        joinColumnsLeft:
                                            joinStep.joinColumnsLeft.filter(
                                                (_: any, i: number) =>
                                                    i !== index
                                            ),
                                        joinColumnsRight:
                                            joinStep.joinColumnsRight.filter(
                                                (_: any, i: number) =>
                                                    i !== index
                                            )
                                    })
                                }
                            >
                                <Delete />
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
