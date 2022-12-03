import React from "react";
import {
    Flex,
    ToggleButton,
    Divider,
    Text,
    DatePicker,
    View
} from "@adobe/react-spectrum";
import { VariableSelector } from "Components/MaticoEditor/Utils/VariableSelector";
import FunctionIcon from "@spectrum-icons/workflow/Function";
import { DatasetColumnSelector } from "Components/MaticoEditor/Utils/DatasetColumnSelector";
import { CalendarDate } from "@internationalized/date";
import { colBasis } from "Utils/columnHelper";
import { DateRangeFilterEditorProps } from "../types";

export const DateRangeFilterEditor: React.FC<DateRangeFilterEditorProps> = ({
    datasetId,
    min,
    max,
    onUpdateFilter,
    selectedColumn,
    columns
}) => {
    const minIsVar = min.hasOwnProperty("var");
    const maxIsVar = max.hasOwnProperty("var");

    const minParsed = minIsVar ? min : new Date(min as Date);
    const maxParsed = maxIsVar ? max : new Date(max as Date);

    const toggleVariableMin = () => {
        if (!minIsVar) {
            onUpdateFilter({
                variable: selectedColumn.name,
                max: maxParsed,
                min: { var: { varId: null, property: min } },
                type: "date"
            });
        } else {
            onUpdateFilter({
                variable: selectedColumn.name,
                max: maxParsed,
                min: new Date(2000, 1, 1),
                type: "date"
            });
        }
    };
    const toggleVariableMax = () => {
        if (!maxIsVar) {
            onUpdateFilter({
                variable: selectedColumn.name,
                max: { var: { varId: null, property: "max" } },
                min: minParsed,
                type: "date"
            });
        } else {
            onUpdateFilter({
                variable: selectedColumn.name,
                max: new Date(2022, 1, 1),
                min: minParsed,
                type: "date"
            });
        }
    };

    return (
        <Flex
            direction="column"
            gap="size-100"
            alignItems="end"
            maxWidth="100%"
            width="100%"
        >
            <Flex direction="row" alignItems="center" width="100%">
                <Text flexBasis={colBasis(2 / 7)}>Column</Text>
                <View flexBasis={colBasis(5 / 7)}>
                    <DatasetColumnSelector
                        columns={columns}
                        datasetName={datasetId}
                        selectedColumn={selectedColumn.name}
                        labelPosition="side"
                        onColumnSelected={(column) =>
                            onUpdateFilter({
                                variable: column.name,
                                min: minParsed,
                                max: maxParsed,
                                type: "date"
                            })
                        }
                    />
                </View>
            </Flex>
            <Flex direction="row" alignItems="end" width="100%">
                <Text flexBasis={colBasis(2 / 7)} id="start-date-label">
                    Start Date
                </Text>
                {!minIsVar ? (
                    <DatePicker
                        key="min_val"
                        width={0}
                        flex={1}
                        flexBasis={colBasis(4 / 7)}
                        aria-labeled-by="start-date-label"
                        value={
                            new CalendarDate(
                                (minParsed as Date).getUTCFullYear(),
                                (minParsed as Date).getUTCMonth(),
                                (minParsed as Date).getUTCDate()
                            )
                        }
                        granularity="day"
                        onChange={(min) => {
                            onUpdateFilter({
                                type: "date",
                                variable: selectedColumn.name,
                                min: new Date(min.year, min.month, min.day),
                                max: maxParsed
                            });
                        }}
                    />
                ) : (
                    <View flexBasis={colBasis(4 / 7)}>
                        <VariableSelector
                            // @ts-ignore
                            variable={minParsed.var}
                            allowedTypes={["dateRange"]}
                            aria-labeled-by="start-date-label"
                            onSelectVariable={(newVar) =>
                                onUpdateFilter({
                                    max: maxParsed,
                                    min: { var: newVar },
                                    variable: selectedColumn.name,
                                    type: "date"
                                })
                            }
                        />
                    </View>
                )}
                <ToggleButton
                    isEmphasized
                    flexBasis={colBasis(1 / 7)}
                    isSelected={minIsVar}
                    onPress={toggleVariableMin}
                >
                    <FunctionIcon />
                </ToggleButton>
            </Flex>
            <Flex direction="row" alignItems="end" width="100%">
                <Text flexBasis={colBasis(2 / 7)} id="end-date-label">
                    End Date
                </Text>
                {!max.hasOwnProperty("var") ? (
                    <DatePicker
                        key="max_val"
                        width={0}
                        flex={1}
                        flexBasis={colBasis(4 / 7)}
                        aria-labeled-by="end-date-label"
                        value={
                            new CalendarDate(
                                (maxParsed as Date).getUTCFullYear(),
                                (maxParsed as Date).getUTCMonth(),
                                (maxParsed as Date).getUTCDate()
                            )
                        }
                        granularity="day"
                        onChange={(max) =>
                            onUpdateFilter({
                                type: "date",
                                variable: selectedColumn.name,
                                min: minParsed,
                                max: new Date(max.year, max.month, max.day)
                            })
                        }
                    />
                ) : (
                    <VariableSelector
                        // @ts-ignore
                        variable={maxParsed.var}
                        allowedTypes={["dateRange"]}
                        aria-labeled-by="end-date-label"
                        onSelectVariable={(newVar) =>
                            onUpdateFilter({
                                min: minParsed,
                                max: { var: newVar },
                                variable: selectedColumn.name,
                                type: "date"
                            })
                        }
                    />
                )}
                <ToggleButton
                    isEmphasized
                    isSelected={maxIsVar}
                    onPress={toggleVariableMax}
                    flexBasis={colBasis(1 / 7)}
                >
                    <FunctionIcon />
                </ToggleButton>
            </Flex>
            <Divider size="S" marginTop="size-100" />
        </Flex>
    );
};
