import React, {useState} from "react";
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
    TextField
} from "@adobe/react-spectrum";
import { VariableSelector } from "Components/MaticoEditor/Utils/VariableSelector";
import { FilterStep, Filter } from "@maticoapp/matico_types/spec";
import FunctionIcon from "@spectrum-icons/workflow/Function";
import { FilterEditor } from "Components/MaticoEditor/Utils/FilterEditor";
import { DatasetColumnSelector } from "Components/MaticoEditor/Utils/DatasetColumnSelector";
import { Column } from "Datasets/Dataset";
import {CalendarDate } from '@internationalized/date';


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
  isOneOf: Array<string|number>, 
  isNotOneOf: Array<string | number>
}

export const FilterStepEditor: React.FC<{
    filterStep: FilterStep;
    onChange: (update: Partial<FilterStep>) => void;
    columns?: Array<Column>;
    datasetId?: string;
}> = ({ filterStep, onChange, datasetId, columns }) => {
    const updateFilterAtIndex = (update: Filter, index: number) => {
        onChange({
            filters: filterStep.filters.map((filter: Filter, i: number) =>
                index === i ? update : filter
            )
        });
    };

    console.log("filter steps ", filterStep)

    return (
        <Flex direction="row" gap={"size-300"}>
            <Flex direction="column" maxWidth="size-1250">
                <Text>
                    Filters allow you to select a subset of dataset rows based
                    on some kind of condition
                </Text>
            </Flex>
            <Divider orientation="vertical" size="S" />
            <Flex direction="column" gap="size-200">
                {filterStep.filters.map((f, index) => {
                    switch (f.type) {
                        case "range":
                            return (
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
                                        updateFilterAtIndex(update, index)
                                    }
                                />
                            );
                        case "category":
                            return (
                                <CategoryFilter
                                    columns={columns}
                                    datasetId={datasetId}
                                    selectedColumn={{name: f.variable, type: "number"}}
                                    isOneOf={f.isOneOf}
                                    onUpdateFilter={(update) =>
                                        updateFilterAtIndex(update,index)
                                    }
                                />
                            );
                        case "date":
                            return (
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
                                        updateFilterAtIndex(update, index)
                                    }
                                />
                            );
                    }
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
                                        min: new Date( 2000, 1, 1),
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

    const minIsVar= min.hasOwnProperty('var')
    const maxIsVar= max.hasOwnProperty('var')
  
    const minParsed = minIsVar ? min : new Date(min)
    const maxParsed = maxIsVar ? max : new Date(max)

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
                min: new Date(2000,1,1),
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
                max: new Date(2022,1,1),
                min: minParsed,
                type: "date"
            });
        }
    };



    return (
        <Flex direction="row" gap="size-100" alignItems="end">
            <DatasetColumnSelector
                columns={columns}
                datasetName={datasetId}
                selectedColumn={selectedColumn.name}
                onColumnSelected={(column) =>
                    onUpdateFilter({
                        variable: column.name,
                        min: minParsed,
                        max: maxParsed,
                        type: "date"
                    })
                }
            />
            {!minIsVar ? (
                <DatePicker
                    key="min_val"
                    value={new CalendarDate(minParsed.getUTCFullYear(),  minParsed.getUTCMonth(),minParsed.getUTCDate() )}
                    label="min"
                    granularity="day"
                    onChange={(min) =>{
                        onUpdateFilter({
                            type: "date",
                            variable: selectedColumn.name,
                            min: new Date(min.year, min.month, min.day),
                            max: maxParsed
                        })
                    }
                    }
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

            { !max.hasOwnProperty('var') ? (
                <DatePicker
                    key="max_val"
                    value={new CalendarDate(maxParsed.getUTCFullYear(),  maxParsed.getUTCMonth(), maxParsed.getUTCDate() )}
                    label="max"
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
        <Flex direction="row" gap="size-100" alignItems="end">
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
            {typeof min === "number" ? (
                <NumberField
                    key="min_val"
                    value={min}
                    label="min"
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

            {typeof max === "number" ? (
                <NumberField
                    value={max}
                    label="max"
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
    );
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    datasetId,
    selectedColumn,
    isOneOf,
    columns,
    onUpdateFilter
}) => {
    return (
        <Flex direction="row" gap={"size-200"}>
            <DatasetColumnSelector
                datasetName={datasetId}
                columns={columns}
                selectedColumn={selectedColumn.name}
                onColumnSelected={(column) =>
                    onUpdateFilter({
                        type: 'category',
                        variable :  column.name,
                        isOneOf: isOneOf
                    })
                    }
            />
              <TextField label="is one of " labelPosition={"side"} value={isOneOf ? isOneOf.join(",") : ""} onChange={(value)=> onUpdateFilter({
                  type:'category',
                  variable : selectedColumn.name,
                  isOneOf: value.split(",").map(v=> isNaN(parseInt(v)) ?  v : parseInt(v))

              })} /> 
        </Flex>
    );
};
