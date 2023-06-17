import React from "react";
import {
    Flex,
    NumberField,
    ToggleButton,
    Text,
    View
} from "@adobe/react-spectrum";
import { VariableSelector } from "Components/VariableSelector/VariableSelector";
import FunctionIcon from "@spectrum-icons/workflow/Function";
import { DatasetColumnSelector } from "Components/DatasetColumnSelector/DatasetColumnSelector";
import { colBasis } from "Utils/columnHelper";
import { RangeFilterEditorProps } from "../types";

export const RangeFilterEditor: React.FC<RangeFilterEditorProps> = ({
    datasetId,
    min,
    max,
    onUpdateFilter,
    selectedColumn,
    columns
}) => {
    const toggleVariableMin = () => {
        if (typeof min === "number") {
            onUpdateFilter({
                variable: selectedColumn.name,
                max,
                min: { var: { varId: null, property: min } },
                type: "range"
            });
        } else {
            onUpdateFilter({
                variable: selectedColumn.name,
                max,
                min: 0,
                type: "range"
            });
        }
    };
    const toggleVariableMax = () => {
        if (typeof max === "number") {
            onUpdateFilter({
                variable: selectedColumn.name,
                max: { var: { varId: null, property: "max" } },
                min,
                type: "range"
            });
        } else {
            onUpdateFilter({
                variable: selectedColumn.name,
                max: 0,
                min,
                type: "range"
            });
        }
    };

    return (
        <Flex
            direction="column"
            alignItems="end"
            gap="size-100"
            maxWidth={"100%"}
            width="100%"
        >
            <Flex direction="row" width="100%" alignItems="center">
                <Text flexBasis={colBasis(2 / 7)} id="filter-column-selector">
                    Column
                </Text>
                <DatasetColumnSelector
                    columns={columns}
                    labeledBy={"filter-column-selector"}
                    datasetName={datasetId}
                    selectedColumn={selectedColumn.name}
                    pickerStyle={{
                        flexBasis: colBasis(5 / 7)
                    }}
                    onColumnSelected={(column) =>
                        onUpdateFilter({
                            variable: column.name,
                            min,
                            max,
                            type: "range"
                        })
                    }
                />
            </Flex>
            <Flex direction="row" alignItems="end" width="100%">
                <Text flexBasis={colBasis(2 / 7)} id="minimum-text-field">
                    Minimum
                </Text>
                {typeof min === "number" ? (
                    <NumberField
                        key="min_val"
                        value={min}
                        flex={1}
                        flexBasis={colBasis(4 / 7)}
                        aria-labeled-by="minimum-text-field"
                        onChange={(min) =>
                            onUpdateFilter({
                                type: "range",
                                variable: selectedColumn.name,
                                min,
                                max
                            })
                        }
                    />
                ) : (
                    <View flexBasis={colBasis(4 / 7)}>
                        <VariableSelector
                            // @ts-ignore
                            variable={min.var}
                            allowedTypes={["range"]}
                            onSelectVariable={(newVar) =>
                                onUpdateFilter({
                                    max,
                                    min: { var: newVar },
                                    variable: selectedColumn.name,
                                    type: "range"
                                })
                            }
                        />
                    </View>
                )}
                <ToggleButton
                    isEmphasized
                    flexBasis={colBasis(1 / 7)}
                    isSelected={typeof min !== "number"}
                    onPress={toggleVariableMin}
                >
                    <FunctionIcon />
                </ToggleButton>
            </Flex>
            <Flex direction="row" alignItems="end" width="100%">
                <Text flexBasis={colBasis(2 / 7)} id="maximum-text-field">
                    Minimum
                </Text>
                {typeof max === "number" ? (
                    <NumberField
                        value={max}
                        flex={1}
                        aria-labeled-by="maximum-text-field"
                        key="max_val"
                        flexBasis={colBasis(4 / 7)}
                        onChange={(max) =>
                            onUpdateFilter({
                                type: "range",
                                variable: selectedColumn.name,
                                max,
                                min
                            })
                        }
                    />
                ) : (
                    <View flexBasis={colBasis(4 / 7)}>
                        <VariableSelector
                            // @ts-ignore
                            variable={max.var}
                            // @ts-ignore
                            labelPosition="side"
                            onSelectVariable={(newVar) =>
                                onUpdateFilter({
                                    type: "range",
                                    max: { var: newVar },
                                    min,
                                    variable: selectedColumn.name
                                })
                            }
                        />
                    </View>
                )}
                <ToggleButton
                    isEmphasized
                    flexBasis={colBasis(1 / 7)}
                    isSelected={typeof max !== "number"}
                    onPress={toggleVariableMax}
                >
                    <FunctionIcon />
                </ToggleButton>
            </Flex>
        </Flex>
    );
};
