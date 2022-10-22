import React from "react";
import { useMaticoSelector } from "Hooks/redux";
import {
    Picker,
    Item,
    Flex,
    Text,
    View,
    Heading,
    CheckboxGroup,
    Checkbox
} from "@adobe/react-spectrum";
import { Column } from "Datasets/Dataset";
import { OptionsPopper } from "../EditorComponents/OptionsPopper";
// import { Item as ListItem, ListView } from "@react-spectrum/list";

interface DatasetColumnSelectorProps {
    datasetName?: string;
    selectedColumn?: string | null;
    columns?: Array<Column>;
    onColumnSelected: (column: Column) => void;
    labelPosition?: "top" | "side";
    label?: string;
    description?: string;
}
export const DatasetColumnSelector: React.FC<DatasetColumnSelectorProps> = ({
    datasetName,
    selectedColumn,
    columns,
    label = "Column",
    labelPosition = "side",
    description,
    onColumnSelected
}) => {
    const foundDataset = useMaticoSelector((state) =>
        datasetName ? state.datasets.datasets[datasetName] : null
    );

    const datasetColumns = foundDataset ? foundDataset.columns : [];
    const cols = columns ?? datasetColumns;

    return (
        <Picker
            width="100%"
            items={cols}
            label={label ?? `Column from {datasetName}`}
            labelPosition={labelPosition}
            isDisabled={!cols}
            selectedKey={selectedColumn}
            onSelectionChange={(column) =>
                onColumnSelected(cols.find((c) => c.name === column))
            }
        >
            {(column) => <Item key={column.name}>{column.name}</Item>}
        </Picker>
    );
};

export interface DatasetColumnSelectorMulitProps {
    datasetName?: string;
    columns?: Array<Column>;
    selectedColumns?: Array<string>;
    onColumnsSelected: (columns: Array<string>) => void;
    labelPosition?: "top" | "side";
    label?: string;
    description?: string;
}

export const DatasetColumnSelectorMulti: React.FC<DatasetColumnSelectorMulitProps> =
    ({
        datasetName,
        selectedColumns,
        onColumnsSelected,
        columns,
        labelPosition,
        label,
        description
    }) => {
        const foundDataset = useMaticoSelector((state) =>
            datasetName ? state.datasets.datasets[datasetName] : null
        );

        const datasetColumns = foundDataset ? foundDataset.columns : [];
        const cols = columns ?? datasetColumns;
        console.log(selectedColumns)
        return (
            <OptionsPopper title={selectedColumns?.length ? `Group by ${selectedColumns.join(", ")}` : label}>
                {description && <Text>{description}</Text>}
                <View maxHeight="150px" overflow={"clip auto"}>
                    <CheckboxGroup
                        value={selectedColumns}
                        onChange={(keys) => {
                            onColumnsSelected(keys);
                        }}
                    >
                        {cols.map((c: Column) => (
                            <Checkbox key={c.name} value={c.name}>
                                {c.name}
                            </Checkbox>
                        ))}
                    </CheckboxGroup>
                </View>
            </OptionsPopper>
        );
    };
