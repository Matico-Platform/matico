import {
    ActionButton,
    Content,
    Dialog,
    DialogTrigger,
    Flex,
    Heading,
    Item,
    NumberField,
    Picker,
    Text,
    ToggleButton
} from "@adobe/react-spectrum";

import { VariableSelector } from "./VariableSelector";

import { Filter, CategoryFilter } from "@maticoapp/matico_types/spec";
import { DatasetState, Column } from "Datasets/Dataset";
import { useMaticoSelector } from "Hooks/redux";
import React from "react";
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

const RangeFilterEditor: React.FC<RangeFilterEditorProps> = ({
    columns,
    selectedColumn,
    min,
    max,
    onUpdateFilter
}) => {

    console.log("Range filter columns ", columns)

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

const EditorForFilter: React.FC<{
    filter: Filter;
    columns: Array<Column>;
    updateFilter: (newFilter: Filter, index: number) => void;
    index: number;
}> = ({ filter = {}, columns = [], updateFilter = () => {}, index = 0 }) => {
    const [filterType, filterParams] = Object.entries(filter)[0];
    if (filterType === "Range") {
        return (
            <RangeFilterEditor
                selectedColumn={columns.find(
                    (c) => c.name === filterParams.variable
                )}
                columns={columns}
                max={filterParams.max}
                min={filterParams.min}
                onUpdateFilter={(newValue) => updateFilter(newValue, index)}
            />
        );
    } else if (filterType === "Category") {
        return (
            <CategoryFilter
                selectedColumn={columns.find(
                    (c) => c.name === filterParams.variable
                )}
                columns={columns}
                categories={filterParams.is_one_of}
                onUpdateFilter={(newValue) => updateFilter(newValue, index)}
            />
        );
    }
    return <Text>Failed to get filter type</Text>;
};


interface FilterBlockProps {
    filters: Array<Filter>;
    columns: Array<Column>;
    updateFilter: (newFilter: Filter, index: number) => void;
}

//@ts-ignore
const FilterBlock: React.FC<FilterBlockProps> = ({
    filters = [],
    columns = [],
    updateFilter = () => {} //@ts-ignore
}) =>
    (
        <>
            {filters?.map((filter, index) => (
                <EditorForFilter
                    key={index}
                    filter={filter}
                    columns={columns}
                    updateFilter={updateFilter}
                    index={index}
                />
            ))}
        </>
    ) ?? <></>;

interface FilterEditorProps {
    filters: Array<any>;
    onUpdateFilters: (update: any) => void;
    datasetName: string;
}
export const FilterEditor: React.FC<FilterEditorProps> = ({
    filters,
    onUpdateFilters,
    datasetName
}) => {
    const dataset = useMaticoSelector(
        (state) => state.datasets.datasets[datasetName]
    );

    const columns =
        dataset && dataset.state === DatasetState.READY ? dataset.columns : [];

    const addFilter = (newFilter: Filter) =>
        onUpdateFilters(filters ? [...filters, newFilter] : [newFilter]);

    const updateFilter = (newFilter: Filter, index: Number) =>
        onUpdateFilters(
            filters.map((filter, i) => (i === index ? newFilter : filter))
        );

    return (
          <Flex direction="column">
              <FilterBlock {...{ columns, filters, updateFilter }} />
          </Flex>
    );
};
