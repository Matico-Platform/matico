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
// import { Item as ListItem, ListView } from "@react-spectrum/list";

interface DatasetColumnSelectorProps {
    datasetName?: string;
    selectedColumn?: string | null;
    onColumnSelected: (column: Column) => void;
    labelPosition?: "top" | "side";
    label?: string;
    description?: string;
}
export const DatasetColumnSelector: React.FC<DatasetColumnSelectorProps> = ({
    datasetName,
    selectedColumn,
    label = "Column",
    labelPosition = "side",
    description,
    onColumnSelected
}) => {
    const foundDataset = useMaticoSelector(
        (state) => state.datasets.datasets[datasetName]
    );

    const columns = foundDataset ? foundDataset.columns : [];

    return (
        <Picker
            width="100%"
            items={columns}
            label={label ?? `Column from {datasetName}`}
            labelPosition={labelPosition}
            isDisabled={!datasetName}
            selectedKey={selectedColumn}
            onSelectionChange={(column) =>
                onColumnSelected(columns.find((c) => c.name === column))
            }
        >
            {(column) => <Item key={column.name}>{column.name}</Item>}
        </Picker>
    );
};

export interface DatasetColumnSelectorMulitProps {
    datasetName?: string;
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
        labelPosition,
        label,
        description
    }) => {
        const foundDataset = useMaticoSelector(
            (state) => state.datasets.datasets[datasetName]
        );

        const columns = foundDataset ? foundDataset.columns : [];

        return (
            <Flex direction="column">
                <Heading>{label}</Heading>
                <View maxHeight="150px" overflow={"clip auto"}>
                <CheckboxGroup
                    value={selectedColumns}
                    onChange={(keys) =>{
                        console.log("keys ", keys)
                        onColumnsSelected(keys)
                    }
                    }
                >
                  {columns.map((c) => (
                            <Checkbox key={c.name} value={c.name}>{c.name}</Checkbox>
                        ))}
                </CheckboxGroup>
              </View>
                {description && <Text>{description}</Text>}
            </Flex>
        );
    };
