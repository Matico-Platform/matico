import React from 'react'

import {AggregateStep, AggregationSummary} from "@maticoapp/matico_types/spec";
import {Flex, Divider, Picker, Item, TextField, ActionButton} from '@adobe/react-spectrum';
import {DatasetColumnSelectorMulti, DatasetColumnSelector} from 'Components/MaticoEditor/Utils/DatasetColumnSelector';
import {Column} from 'Datasets/Dataset';

export const AggregateStepEditor: React.FC<{
    step: AggregateStep;
    datasetId?: string;
    columns? : Array<Column>
    onChange: (update: Partial<AggregateStep>) => void;
}> = ({ step, datasetId, onChange, columns }) => {
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
        <Flex direction="row" gap="size-200" minWidth={"size-1250"}>
            <DatasetColumnSelectorMulti
                label="Columns to group by"
                datasetName={datasetId}
                columns={columns}
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

