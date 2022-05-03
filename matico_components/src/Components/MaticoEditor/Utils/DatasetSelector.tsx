import React from "react";
import { useMaticoSelector } from "Hooks/redux";
import { Picker, Item,Text, Flex} from "@adobe/react-spectrum";

interface DatasetSelectorProps {
  selectedDataset?: string;
  onDatasetSelected: (datasetName: string) => void;
  description?:string,
  label?: string
}
export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  selectedDataset,
  onDatasetSelected,
  label,
  description
}) => {
  const datasets = useMaticoSelector((state) => state.datasets.datasets);
  if(!datasets){
    return <Text>Loading</Text>
  }
  return (
    <Picker
      items={Object.values(datasets)}
      selectedKey={selectedDataset}
      onSelectionChange={(dataset) => onDatasetSelected(dataset as string)}
      label={label ?? "Dataset"}
      description={description}
      width="100%"
    >
      {(dataset) => <Item key={dataset.name}>{dataset.name}</Item>}
    </Picker>
  );
};
