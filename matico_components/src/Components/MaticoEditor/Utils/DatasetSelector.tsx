import React from "react";
import { useMaticoSelector } from "Hooks/redux";
import { Picker, Item, Text } from "@adobe/react-spectrum";
import {LabelPosition} from "@react-types/shared";

interface DatasetSelectorProps {
    selectedDataset?: string;
    onDatasetSelected: (datasetName: string) => void;
    description?: string;
    label?: string;
    labelPosition?: LabelPosition
}
export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
    selectedDataset,
    onDatasetSelected,
    label,
    labelPosition="side",
    description
}) => {
    const datasets = useMaticoSelector((state) => state.datasets.datasets);
    if (!datasets) {
        return <Text>Loading</Text>;
    }
    if(datasets && Object.keys(datasets).length===0){
      return <Text>No datasets registered. Add some using the dataset pane on the left toolbar!</Text>
    }
    return (
        <Picker
            items={Object.values(datasets)}
            selectedKey={selectedDataset}
            onSelectionChange={(dataset) =>
                onDatasetSelected(dataset as string)
            }
            label={label ?? "Dataset"}
            labelPosition={labelPosition}
            description={description}
            marginY="size-50"
            width="100%"
        >
            {(dataset) => <Item key={dataset.name}>{dataset.name}</Item>}
        </Picker>
    );
};
