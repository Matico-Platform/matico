import React, { useState } from "react";
import {
    DialogTrigger,
    ActionButton,
    Dialog,
    Content,
    Flex,
    Picker,
    Item,
    NumberField,
    ToggleButton,
    Divider,
    Text,
    DateRangePicker,
    DatePicker,
    TextField,
    Well,
    View
} from "@adobe/react-spectrum";
import { VariableSelector } from "Components/MaticoEditor/Utils/VariableSelector";
import { FilterStep, Filter } from "@maticoapp/matico_types/spec";
import FunctionIcon from "@spectrum-icons/workflow/Function";
import { FilterEditor } from "Components/MaticoEditor/Utils/FilterEditor";
import { DatasetColumnSelector } from "Components/MaticoEditor/Utils/DatasetColumnSelector";
import { Column } from "Datasets/Dataset";
import { CalendarDate } from "@internationalized/date";
import { OptionsPopper } from "../OptionsPopper";
import Delete from "@spectrum-icons/workflow/Delete";
import { nicelyFormatNumber } from "Components/Panes/MaticoLegendPane/MaticoLegendPane";
import { CollapsibleSection } from "../CollapsibleSection";
import Calendar from "@spectrum-icons/workflow/Calendar";
import Shapes from "@spectrum-icons/workflow/Shapes";
import Numbers from "@spectrum-icons/workflow/123";
interface FilterEditor {
    datasetId?: string;
    selectedColumn: Column;
    columns?: Array<Column>;
    onUpdateFilter: (newFilter: any) => void;
}

interface RangeFilterEditorProps extends FilterEditor {
    min?: number | { var: string };
    max?: number | { var: string };
}

interface DateRangeFilterEditorProps extends FilterEditor {
    min?: Date | { var: string };
    max?: Date | { var: string };
}

interface CategoryFilterProps extends FilterEditor {
    isOneOf: Array<string | number>;
    isNotOneOf: Array<string | number>;
}

const generateFilterText = (f: Filter) => {
    switch (f.type) {
        case "noFilter":
            return "No filter";
        case "range": {
            if (f.variable) {
                const minText =
                    typeof f?.min === "object" && f?.min?.hasOwnProperty("var")
                        ? "𝑓.min"
                        : nicelyFormatNumber(f.min);

                const maxText =
                    typeof f?.max === "object" && f?.max?.hasOwnProperty("var")
                        ? "𝑓.max"
                        : nicelyFormatNumber(f.max);

                return `${
                    f.variable || "Variable"
                } between ${minText} & ${maxText}`;
            } else {
                return "Select a column to filter";
            }
        }
        case "date": {
            if (f.variable) {
                const minText =
                    typeof f?.min === "object" && f?.min?.hasOwnProperty("var")
                        ? "𝑓.min"
                        : new Date(f.min).toISOString().slice(0, 10);

                const maxText =
                    typeof f?.max === "object" && f?.max?.hasOwnProperty("var")
                        ? "𝑓.max"
                        : new Date(f.max).toISOString().slice(0, 10);

                return `${
                    f.variable || "Variable"
                } between ${minText} & ${maxText}`;
            } else {
                return "Select a column to filter";
            }
        }
        case "category": {
            if (f.variable) {
                return `${f.variable} ${
                    f.isOneOf.length > 0
                        ? `is one of ${f.isOneOf.join(", ")}`
                        : ""
                } ${
                    f.isNotOneOf.length > 0
                        ? `is not one of ${f.isNotOneOf.join(", ")}`
                        : ""
                }`;
            } else {
                return "Select a column to filter";
            }
        }
    }
    return "Filter Text";
};

export const FilterStepEditor: React.FC<{
    filterStep: FilterStep;
    onChange: (update: Partial<FilterStep>) => void;
    columns?: Array<Column>;
    datasetId?: string;
}> = ({ filterStep, onChange, datasetId, columns }) => {
    const updateFilterAtIndex = (
        update: Filter,
        index: number,
        action: "update" | "remove"
    ) => {
        switch (action) {
            case "update": {
                onChange({
                    filters: filterStep.filters.map(
                        (filter: Filter, i: number) =>
                            index === i ? update : filter
                    )
                });
                break;
            }
            case "remove": {
                const filters = filterStep.filters;
                onChange({
                    filters: [
                        ...filters.slice(0, index),
                        ...filters.slice(index + 1)
                    ]
                });
            }
        }
    };

    console.log("filter steps ", filterStep);

    return (
        <View>
            <Flex direction="column" gap={"size-50"}>
                <Flex direction="column" gap="size-50">
                    {filterStep.filters.map((f, index: number) => {
                        let filterEl = null;
                        let icon = null;
                        const filterText = generateFilterText(f);
                        switch (f.type) {
                            case "range":
                                filterEl = (
                                    <RangeFilterEditor
                                        columns={columns}
                                        datasetId={datasetId}
                                        selectedColumn={{
                                            name: f.variable,
                                            type: "number"
                                        }}
                                        max={f.max}
                                        min={f.min}
                                        onUpdateFilter={(update) =>
                                            updateFilterAtIndex(
                                                update,
                                                index,
                                                "update"
                                            )
                                        }
                                    />
                                );
                                icon = <Numbers />;
                                break;
                            case "category":
                                filterEl = (
                                    <CategoryFilter
                                        columns={columns}
                                        datasetId={datasetId}
                                        selectedColumn={{
                                            name: f.variable,
                                            type: "number"
                                        }}
                                        isOneOf={f.isOneOf}
                                        onUpdateFilter={(update) =>
                                            updateFilterAtIndex(
                                                update,
                                                index,
                                                "update"
                                            )
                                        }
                                    />
                                );
                                icon = <Shapes />;
                                break;
                            case "date":
                                filterEl = (
                                    <DateRangeFilterEditor
                                        columns={columns}
                                        datasetId={datasetId}
                                        selectedColumn={{
                                            name: f.variable,
                                            colType: "date"
                                        }}
                                        max={f.max}
                                        min={f.min}
                                        onUpdateFilter={(update) =>
                                            updateFilterAtIndex(
                                                update,
                                                index,
                                                "update"
                                            )
                                        }
                                    />
                                );
                                icon = <Calendar />
                                break;
                            default:
                                filterEl = null;
                                break;
                        }
                        return (
                            <Flex gap="size-25" direction="row" alignItems="start">
                                <CollapsibleSection title={filterText} icon={icon} isOpen={true}>
                                    {filterEl}
                                </CollapsibleSection>

                                <ActionButton
                                        isQuiet
                                        marginY="size-100"
                                        onPress={() =>
                                            updateFilterAtIndex(
                                                null,
                                                index,
                                                "remove"
                                            )
                                        }
                                        aria-label="Remove"
                                    >
                                        <Delete />
                                </ActionButton>
                            </Flex>
                        );
                    })}

                    <FilterTypeDialog
                        onSubmit={(newFilter) =>
                            onChange({
                                filters: [...filterStep.filters, newFilter]
                            })
                        }
                    />
                </Flex>
            </Flex>
        </View>
    );
};

const FilterTypeDialog: React.FC<{ onSubmit: (newFilter: any) => void }> = ({
    onSubmit
}) => {
    return (
        <DialogTrigger isDismissable type="popover">
            <ActionButton>Add Filter</ActionButton>
            {(close) => (
                <Dialog>
                    <Content>
                        <Flex direction="column" gap={"size-200"}>
                            <ActionButton
                                onPress={() => {
                                    onSubmit({
                                        variable: null,
                                        min: 0,
                                        max: 100,
                                        type: "range"
                                    });
                                    close();
                                }}
                            >
                                Range
                            </ActionButton>
                            <ActionButton
                                onPress={() => {
                                    onSubmit({
                                        variable: null,
                                        min: new Date(2000, 1, 1),
                                        max: new Date(2022, 1, 1),
                                        type: "date"
                                    });
                                    close();
                                }}
                            >
                                Date Range
                            </ActionButton>
                            <ActionButton
                                onPress={() => {
                                    onSubmit({
                                        variable: null,
                                        is_one_of: [],
                                        type: "category"
                                    });
                                    close();
                                }}
                            >
                                Category
                            </ActionButton>
                        </Flex>
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};

const DateRangeFilterEditor: React.FC<DateRangeFilterEditorProps> = ({
    datasetId,
    min,
    max,
    onUpdateFilter,
    selectedColumn,
    columns
}) => {
    const minIsVar = min.hasOwnProperty("var");
    const maxIsVar = max.hasOwnProperty("var");

    const minParsed = minIsVar ? min : new Date(min);
    const maxParsed = maxIsVar ? max : new Date(max);

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
            gap="size-50"
            alignItems="end"
            maxWidth="100%"
            width="100%"
        >
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
            <Flex direction="row" alignItems="end" gap="size-100" width="100%">
                {!minIsVar ? (
                    <DatePicker
                        key="min_val"
                        width={0}
                        flex={1}
                        value={
                            new CalendarDate(
                                minParsed.getUTCFullYear(),
                                minParsed.getUTCMonth(),
                                minParsed.getUTCDate()
                            )
                        }
                        label="Start"
                        labelPosition="side"
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
                    <VariableSelector
                        variable={minParsed.var}
                        allowedTypes={["dateRange"]}
                        onSelectVariable={(newVar) =>
                            onUpdateFilter({
                                max: maxParsed,
                                min: { var: newVar },
                                variable: selectedColumn.name,
                                type: "date"
                            })
                        }
                    />
                )}
                <ToggleButton
                    isEmphasized
                    isSelected={minIsVar}
                    onPress={toggleVariableMin}
                >
                    <FunctionIcon />
                </ToggleButton>
            </Flex>
            <Flex direction="row" alignItems="end" gap="size-100" width="100%">
                {!max.hasOwnProperty("var") ? (
                    <DatePicker
                        key="max_val"
                        width={0}
                        flex={1}
                        value={
                            new CalendarDate(
                                maxParsed.getUTCFullYear(),
                                maxParsed.getUTCMonth(),
                                maxParsed.getUTCDate()
                            )
                        }
                        label="End"
                        labelPosition="side"
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
                        variable={maxParsed.var}
                        allowedTypes={["dateRange"]}
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
                >
                    <FunctionIcon />
                </ToggleButton>
            </Flex>
            <Divider size="S" marginTop="size-100" />
        </Flex>
    );
};

const RangeFilterEditor: React.FC<RangeFilterEditorProps> = ({
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
            gap="size-50"
            maxWidth={"100%"}
            width="100%"
        >
            <DatasetColumnSelector
                columns={columns}
                datasetName={datasetId}
                selectedColumn={selectedColumn.name}
                onColumnSelected={(column) =>
                    onUpdateFilter({
                        variable: column.name,
                        min,
                        max,
                        type: "range"
                    })
                }
            />
            <Flex direction="row" alignItems="end" gap="size-100" width="100%">
                {typeof min === "number" ? (
                    <NumberField
                        key="min_val"
                        value={min}
                        flex={1}
                        labelPosition="side"
                        label="Min"
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
                    <VariableSelector
                        variable={min.var}
                        allowedTypes={["range"]}
                        labelPosition="side"
                        onSelectVariable={(newVar) =>
                            onUpdateFilter({
                                max,
                                min: { var: newVar },
                                variable: selectedColumn.name,
                                type: "range"
                            })
                        }
                    />
                )}
                <ToggleButton
                    isEmphasized
                    isSelected={typeof min !== "number"}
                    onPress={toggleVariableMin}
                >
                    <FunctionIcon />
                </ToggleButton>
            </Flex>
            <Flex direction="row" alignItems="end" gap="size-100" width="100%">
                {typeof max === "number" ? (
                    <NumberField
                        value={max}
                        flex={1}
                        label="Max"
                        labelPosition="side"
                        key="max_val"
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
                    <VariableSelector
                        variable={max.var}
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
                )}
                <ToggleButton
                    isEmphasized
                    isSelected={typeof max !== "number"}
                    onPress={toggleVariableMax}
                >
                    <FunctionIcon />
                </ToggleButton>
            </Flex>
        </Flex>
    );
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    datasetId,
    selectedColumn,
    isOneOf,
    columns,
    onUpdateFilter
}) => {
    const toggleHasOneOf = () => {
        if (isOneOf?.hasOwnProperty("var")) {
            onUpdateFilter({
                variable: selectedColumn.name,
                isOneOf: [],
                type: "category"
            });
        } else {
            onUpdateFilter({
                variable: selectedColumn.name,
                isOneOf: { var: { varId: null, property: null } },
                type: "category"
            });
        }
    };
    return (
        <Flex direction="column" gap={"size-200"} width="100%">
            <DatasetColumnSelector
                datasetName={datasetId}
                columns={columns}
                selectedColumn={selectedColumn.name}
                onColumnSelected={(column) =>
                    onUpdateFilter({
                        type: "category",
                        variable: column.name,
                        isOneOf: isOneOf
                    })
                }
            />
            {isOneOf?.hasOwnProperty("var") ? (
                <VariableSelector
                    variable={isOneOf.var}
                    allowedTypes={["selection"]}
                    onSelectVariable={(newVar) =>
                        onUpdateFilter({
                            isOneOf: { var: newVar },
                            variable: selectedColumn.name,
                            type: "category"
                        })
                    }
                />
            ) : (
                <TextField
                    label="is one of "
                    labelPosition={"side"}
                    value={isOneOf ? isOneOf.join(",") : ""}
                    onChange={(value) =>
                        onUpdateFilter({
                            type: "category",
                            variable: selectedColumn.name,
                            isOneOf: value
                                .split(",")
                                .map((v) =>
                                    isNaN(parseInt(v)) ? v : parseInt(v)
                                )
                        })
                    }
                />
            )}
            <ToggleButton
                isEmphasized
                isSelected={isOneOf?.hasOwnProperty("var")}
                onPress={toggleHasOneOf}
            />
        </Flex>
    );
};
