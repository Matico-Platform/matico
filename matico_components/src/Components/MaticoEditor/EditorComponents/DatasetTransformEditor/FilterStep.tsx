import React from 'react'
import {DialogTrigger, ActionButton, Dialog, Content, Flex, Picker, Item, NumberField, ToggleButton, Divider, Text} from '@adobe/react-spectrum';
import {VariableSelector} from 'Components/MaticoEditor/Utils/VariableSelector';
import {Column} from '@maticoapp/matico_types/api/Column';
import {FilterStep} from '@maticoapp/matico_types/spec';
import FunctionIcon from "@spectrum-icons/workflow/Function";

interface FilterEditor {
    columns: Array<Column>;
    selectedColumn: Column;
    onUpdateFilter: (newFilter: any) => void;
}

interface RangeFilterEditorProps extends FilterEditor {
    min?: number | { var: string };
    max?: number | { var: string };
}

interface CategoryFilterProps extends FilterEditor {
    categories: Array<string>;
}

export const FilterStepEditor: React.FC<{
    filterStep: FilterStep;
    onChange: (update: Partial<FilterStep>) => void;
    datasetId: string;
}> = ({ filterStep, onChange, datasetId }) => {
    return (
          <Flex direction="row" gap={"size-300"}>
            <Flex direction="column" width="size-1000">
              <Text>Filters allow you to select a subset of dataset rows based on some kind of condition</Text>
            </Flex>
              <Divider orientation="vertical" size="S" />
            <Flex direction="column" gap="size-200">
                  <FilterTypeDialog onSubmit={(newFilter) =>onChange({filters: [...filterStep.filters, newFilter]})}/>
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
                        <Flex direction="column">
                            <ActionButton
                                onPress={() => {
                                    onSubmit({
                                        Range: {
                                            variable: null,
                                            min: 0,
                                            max: 100
                                        }
                                    });
                                    close();
                                }}
                            >
                                Range
                            </ActionButton>
                            <ActionButton
                                onPress={() => {
                                    onSubmit({
                                        Category: {
                                            variable: null,
                                            is_one_of: []
                                        }
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


const RangeFilterEditor: React.FC<RangeFilterEditorProps> = ({
    columns,
    selectedColumn,
    min,
    max,
    onUpdateFilter
}) => {

    const toggleVariableMin = () => {
        if (typeof min === "number") {
            onUpdateFilter({
                Range: { variable: selectedColumn.name, max, min: { var: "" } }
            });
        } else {
            onUpdateFilter({
                Range: { variable: selectedColumn.name, max, min: 0 }
            });
        }
    };
    const toggleVariableMax = () => {
        if (typeof max === "number") {
            onUpdateFilter({
                Range: { variable: selectedColumn.name, max: { var: "" }, min }
            });
        } else {
            onUpdateFilter({
                Range: { variable: selectedColumn.name, max: 0, min }
            });
        }
    };
    return (
        <Flex direction="row" gap="size-100" alignItems="end">
            <Picker
                label="column"
                items={columns}
                selectedKey={selectedColumn?.name}
                onSelectionChange={(variable) =>
                    onUpdateFilter({ Range: { variable, max, min } })
                }
            >
                {(column) => <Item key={column.name}>{column.name}</Item>}
            </Picker>

            {typeof min === "number" ? (
                <NumberField
                    key="min_val"
                    value={min}
                    label="min"
                    onChange={(min) =>
                        onUpdateFilter({
                            Range: { variable: selectedColumn.name, min, max }
                        })
                    }
                />
            ) : (
                <VariableSelector
                    variable={min.var}
                    onSelectVariable={(newVar) =>
                        onUpdateFilter({
                            Range: {
                                max,
                                min: { var: newVar },
                                variable: selectedColumn.name
                            }
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
                            Range: { variable: selectedColumn.name, max, min }
                        })
                    }
                />
            ) : (
                <VariableSelector
                    variable={max.var}
                    onSelectVariable={(newVar) =>
                        onUpdateFilter({
                            Range: {
                                max: { var: newVar },
                                min,
                                variable: selectedColumn.name
                            }
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
    columns,
    selectedColumn,
    categories,
    onUpdateFilter
}) => {
    return (
        <Flex direction="row">
            <Picker
                label="column"
                items={columns}
                selectedKey={selectedColumn?.name}
            >
                {(column) => <Item key={column.name}>{column.name}</Item>}
            </Picker>
        </Flex>
    );
};
