import React from 'react'
import {Flex, Picker, Item, TextField, Divider, ActionButton} from '@adobe/react-spectrum';
import {JoinStep} from '@maticoapp/matico_types/spec';
import Delete from '@spectrum-icons/workflow/Delete';
import {DatasetColumnSelector} from 'Components/MaticoEditor/Utils/DatasetColumnSelector';
import {DatasetSelector} from 'Components/MaticoEditor/Utils/DatasetSelector';

export const JoinStepEditor: React.FC<{
    joinStep: JoinStep;
    onChange: (update: Partial<JoinStep>) => void;
    datasetId: string;
}> = ({ joinStep, onChange, datasetId }) => {

    return (
        <Flex direction="row" gap={"size-300"}>
            <Flex direction="column" width="size-1000">
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
                <TextField label="Left Prefix" value={joinStep.rightPrefix} onChange={(rightPrefix)=> onChange({rightPrefix})} />
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
                                datasetName={datasetId}
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
