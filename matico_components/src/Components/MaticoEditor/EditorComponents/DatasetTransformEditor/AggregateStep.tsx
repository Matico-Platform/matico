import React from "react";

import {
    AggregateStep,
    AggregationType,
    AggregationSummary
} from "@maticoapp/matico_types/spec";

import {
    Flex,
    Divider,
    Picker,
    Item,
    TextField,
    ActionButton,
    ActionGroup
} from "@adobe/react-spectrum";
import {
    DatasetColumnSelectorMulti,
    DatasetColumnSelector
} from "Components/MaticoEditor/Utils/DatasetColumnSelector";
import { Column } from "Datasets/Dataset";
import { CollapsibleSection } from "../CollapsibleSection";
import Delete from "@spectrum-icons/workflow/Delete";

export const AggregateStepEditor: React.FC<{
    step: AggregateStep;
    datasetId?: string;
    columns?: Array<Column>;
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
    const removeAggregate = (index: number) => {
        onChange({
            aggregate: [
                ...step.aggregate.slice(0, index),
                ...step.aggregate.slice(index + 1)
            ]
        });
    };

    return (
        <Flex direction="column" gap="size-100">
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
            <Flex direction="column" gap="size-100">
                {step.aggregate.map(
                    (agg: AggregationSummary, index: number) => (
                        <Flex direction="row" gap="size-100" key={index}>
                            <CollapsibleSection
                                title={
                                    agg.column
                                        ? `${agg.aggType} "${agg.column}" as '${agg.rename}'`
                                        : "Select a column to aggregate"
                                }
                                titleStyle={{
                                    textTransform: "capitalize"
                                }}
                            >
                                <Flex
                                    direction="column"
                                    gap="size-100"
                                    width="100%"
                                >
                                    <DatasetColumnSelector
                                        datasetName={datasetId}
                                        selectedColumn={agg.column}
                                        onColumnSelected={(column) =>
                                            updateAggregate(index, {
                                                column: column.name
                                            })
                                        }
                                    />
                                    {/* <Picker
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
                                            updateAggregate(index, { aggType: aggType as AggregationType })
                                        }
                                        selectedKey={agg.aggType}
                                    >
                                        {(item) => (
                                            <Item key={item.id}>
                                                {item.label}
                                            </Item>
                                        )}
                                    </Picker> */}
                                    <ActionGroup
                                        aria-label="Aggregate type"
                                        density={"compact"}
                                        isEmphasized
                                        overflowMode="wrap"
                                        selectionMode="single"
                                        selectedKeys={[agg.aggType]}
                                        items={[
                                            { id: "min", label: "Min" },
                                            { id: "max", label: "Max" },
                                            { id: "mean", label: "Mean" },
                                            { id: "sum", label: "Sum" },
                                            { id: "median", label: "Median" }
                                        ]}
                                        onSelectionChange={(aggList) =>
                                            updateAggregate(index, {
                                                aggType: [
                                                    ...aggList
                                                ][0] as AggregationType
                                            })
                                        }
                                    >
                                        {(item) => (
                                            <Item key={item.id}>
                                                {item.label}
                                            </Item>
                                        )}
                                    </ActionGroup>
                                    <TextField
                                        labelPosition="side"
                                        label="Rename result"
                                        value={agg.rename}
                                        onChange={(rename) =>
                                            updateAggregate(index, { rename })
                                        }
                                    />
                                </Flex>
                            </CollapsibleSection>

                            <ActionButton
                                isQuiet
                                marginY="size-100"
                                onPress={() => removeAggregate(index)}
                                aria-label="Remove"
                            >
                                <Delete />
                            </ActionButton>
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
                >
                    Add Aggregate
                </ActionButton>
            </Flex>
        </Flex>
    );
};
