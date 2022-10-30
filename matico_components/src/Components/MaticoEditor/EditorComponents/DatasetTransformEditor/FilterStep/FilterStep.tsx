import React from "react";
import { ActionButton, Flex, View } from "@adobe/react-spectrum";
// @ts-ignore
import { FilterStep, Filter } from "@maticoapp/matico_types/spec";
import { FilterEditor } from "Components/MaticoEditor/Utils/FilterEditor";
import { Column } from "Datasets/Dataset";
import Delete from "@spectrum-icons/workflow/Delete";
import { CollapsibleSection } from "../../CollapsibleSection";
import Calendar from "@spectrum-icons/workflow/Calendar";
import Shapes from "@spectrum-icons/workflow/Shapes";
import Numbers from "@spectrum-icons/workflow/123";
import { colBasis } from "Utils/columnHelper";
import { DateRangeFilterEditor } from "./DateRangeFilterEditor";
import { CategoryFilter } from "./CategoryFilter";
import { RangeFilterEditor } from "./RangeFilterEditor";
import { FilterTypeDialog } from "./FilterTypeDialog";
import { generateFilterText } from "../DatasetTransformEditorUtils";

interface FilterEditor {
    datasetId?: string;
    selectedColumn: Column;
    columns?: Array<Column>;
    onUpdateFilter: (newFilter: any) => void;
}

interface DateRangeFilterEditorProps extends FilterEditor {
    min?: Date | { var: string };
    max?: Date | { var: string };
}

interface CategoryFilterProps extends FilterEditor {
    isOneOf: Array<string | number>;
    isNotOneOf?: Array<string | number>;
}

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

    // console.log("filter steps ", filterStep);

    return (
        <View>
            <Flex direction="column" gap={"size-100"}>
                <Flex direction="column" gap="size-100">
                    {filterStep.filters.map((f: Filter, index: number) => {
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
                                        isNotOneOf={f.isNotOneOf}
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
                                            // @ts-ignore
                                            colType: "date"
                                        }}
                                        // @ts-ignore
                                        max={f.max}
                                        // @ts-ignore
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
                                icon = <Calendar />;
                                break;
                            default:
                                filterEl = null;
                                break;
                        }
                        return (
                            <Flex
                                gap="size-25"
                                direction="row"
                                alignItems="start"
                            >
                                <CollapsibleSection
                                    title={filterText}
                                    icon={icon}
                                    isOpen={true}
                                    outerStyle={{ flexBasis: colBasis(7 / 8) }}
                                >
                                    {filterEl}
                                </CollapsibleSection>

                                <ActionButton
                                    isQuiet
                                    flexBasis={colBasis(1 / 8)}
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
