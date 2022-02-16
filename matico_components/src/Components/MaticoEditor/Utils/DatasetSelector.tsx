import React from "react";
import { useMaticoSelector } from "Hooks/redux";
import { Picker, Item,Text, Flex} from "@adobe/react-spectrum";

interface DatasetSelectorProps {
  selectedDataset?: string;
  onDatasetSelected: (datasetName: string) => void;
}
export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  selectedDataset,
  onDatasetSelected,
}) => {
  const datasets = useMaticoSelector((state) => state.datasets.datasets);
  if(!datasets){
    return <Text>Loading</Text>
  }
  return (
    <Flex>
    <Picker
      items={Object.values(datasets)}
      selectedKey={selectedDataset}
      onSelectionChange={(dataset) => onDatasetSelected(dataset as string)}
      label="Dataset"
      width="100%"
    >
      {(dataset) => <Item key={dataset.name}>{dataset.name}</Item>}
    </Picker>
  </Flex>
  );
};
