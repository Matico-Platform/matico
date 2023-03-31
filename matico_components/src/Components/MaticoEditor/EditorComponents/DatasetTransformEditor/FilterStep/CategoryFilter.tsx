import React, { useState } from "react";
import { CategoryFilterProps } from "../types";
import {
    ActionButton,
    Flex,
    Text,
    TextField,
    Well,
    View,
    ToggleButton,
    RadioGroup,
    Radio
} from "@adobe/react-spectrum";
import { VariableSelector } from "Components/MaticoEditor/Utils/VariableSelector";
import FunctionIcon from "@spectrum-icons/workflow/Function";
import { DatasetColumnSelector } from "Components/MaticoEditor/Utils/DatasetColumnSelector";
import AddCircle from "@spectrum-icons/workflow/AddCircle";
import { colBasis } from "Utils/columnHelper";
import { EditablePillButton } from "../EditablePillButton";

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    datasetId,
    selectedColumn,
    isOneOf,
    isNotOneOf,
    columns,
    onUpdateFilter
}) => {
    // internal state
    const [filterText, setFilterText] = useState("");
    const addCurrentText = () => {
        handleAddCategory(filterText.trim());
        setFilterText("");
    };

    // component state abstraction
    const filterMode =
        // @ts-ignore sometimes isNotONeOf is an object. This defaults to isOneOf if both undefined
        Array.isArray(isNotOneOf) || isNotOneOf?.hasOwnProperty("var")
            ? "exclude"
            : "match";
    const values = filterMode === "match" ? isOneOf : isNotOneOf;

    // handlers
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

    const handleAddCategory = (category: string) => {
        const newValues = [...(values || []), category];
        onUpdateFilter({
            variable: selectedColumn.name,
            isOneOf: filterMode === "match" ? newValues : undefined,
            isNotOneOf: filterMode === "exclude" ? newValues : undefined,
            type: "category"
        });
    };

    const handleRemoveIndex = (index: number) => {
        const newValues = values.filter((_, i) => i !== index);
        onUpdateFilter({
            variable: selectedColumn.name,
            isOneOf: filterMode === "match" ? newValues : undefined,
            isNotOneOf: filterMode === "exclude" ? newValues : undefined,
            type: "category"
        });
    };
    const handleEditAtIndex = (index: number, value: string) => {
        const newValues = values.map((v, i) => (i === index ? value : v));
        onUpdateFilter({
            variable: selectedColumn.name,
            isOneOf: filterMode === "match" ? newValues : undefined,
            isNotOneOf: filterMode === "exclude" ? newValues : undefined,
            type: "category"
        });
    };

    const toggleFilterMode = (newMode: "match" | "exclude") => {
        const cloneValues = values || [];
        onUpdateFilter({
            isOneOf: newMode === "match" ? cloneValues : undefined,
            isNotOneOf: newMode === "exclude" ? cloneValues : undefined,
            type: "category"
        });
    };

    return (
        <Flex direction="column" gap={"size-100"} width="100%">
            <Flex direction="row" alignItems="center" width="100%">
                <Text flexBasis={colBasis(2 / 7)} id="filter-column-selector">
                    Column
                </Text>
                <View flexBasis={colBasis(5 / 7)}>
                    <DatasetColumnSelector
                        datasetName={datasetId}
                        columns={columns}
                        labeledBy={"filter-column-selector"}
                        ariaLabel="Select a column to filter"
                        selectedColumn={selectedColumn.name}
                        onColumnSelected={(column) =>
                            onUpdateFilter({
                                type: "category",
                                variable: column.name,
                                isOneOf: isOneOf
                            })
                        }
                    />
                </View>
            </Flex>
            <Flex direction="row" alignItems="center">
                <Text
                    flexBasis={colBasis(2 / 7)}
                    id="filter-mode-radio-buttons"
                >
                    Filter Mode
                </Text>
                <View flexBasis={colBasis(5 / 7)}>
                    <RadioGroup
                        aria-labeled-by="filter-mode-radio-buttons"
                        orientation="horizontal"
                        value={filterMode}
                        onChange={toggleFilterMode}
                    >
                        <Radio value="match">Match</Radio>
                        <Radio value="exclude">Exclude</Radio>
                    </RadioGroup>
                </View>
            </Flex>
            <Flex
                direction="column"
                alignItems="center"
                width="100%"
                gap="size-100"
            >
                {!!selectedColumn?.name && (
                    <Text id="filter-category-selector">
                        {`${selectedColumn.name} is ${filterMode === "exclude" ? "not " : ""
                            } one of the following`}
                    </Text>
                )}
                {!values?.hasOwnProperty("var") && (
                    <Well width="100%">
                        <Flex
                            direction="row"
                            alignItems="center"
                            width="100%"
                            wrap={true}
                            gap="size-25"
                        >
                            {!values?.length && (
                                <Text>Add entries in the text field below</Text>
                            )}
                            {values?.map((val, i) => (
                                <EditablePillButton
                                    key={i}
                                    value={val}
                                    onEdit={(newVal) =>
                                        handleEditAtIndex(i, newVal)
                                    }
                                    onDelete={() => handleRemoveIndex(i)}
                                    pillColor={
                                        filterMode === "match"
                                            ? "positive"
                                            : "negative"
                                    }
                                />
                            ))}
                        </Flex>
                    </Well>
                )}
                <Flex direction="row" alignItems="center" width="100%">
                    {values?.hasOwnProperty("var") ? (
                        <VariableSelector
                            // @ts-ignore
                            variable={values.var}
                            allowedTypes={["selection", "category"]}
                            onSelectVariable={(newVar) =>
                                onUpdateFilter({
                                    isOneOf: { var: newVar },
                                    variable: selectedColumn.name,
                                    type: "category"
                                })
                            }
                        />
                    ) : (
                        <>
                            <TextField
                                width="100%"
                                flexBasis={colBasis(5 / 7)}
                                value={filterText}
                                onChange={setFilterText}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") addCurrentText();
                                }}
                            />
                            <View
                                flexBasis={colBasis(1 / 7)}
                                backgroundColor={
                                    filterText.length > 0
                                        ? "positive"
                                        : "gray-100"
                                }
                            >
                                <Flex
                                    alignItems="center"
                                    height="100%"
                                    justifyContent="center"
                                >
                                    <ActionButton
                                        isQuiet
                                        aria-label="Add current text as category filter"
                                        onPress={addCurrentText}
                                        isDisabled={filterText.length === 0}
                                    >
                                        <AddCircle />
                                    </ActionButton>
                                </Flex>
                            </View>
                        </>
                    )}

                    <ToggleButton
                        isEmphasized
                        flexBasis={colBasis(1 / 7)}
                        isSelected={isOneOf?.hasOwnProperty("var")}
                        onPress={toggleHasOneOf}
                    >
                        <FunctionIcon />
                    </ToggleButton>
                </Flex>
            </Flex>
        </Flex>
    );
};
