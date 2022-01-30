import { Text, Box, Select } from "grommet";
import React, { useContext } from "react";
import { MaticoDataContext } from "Contexts/MaticoDataContext/MaticoDataContext";
import {useMaticoSelector} from "Hooks/redux";

interface DatasetSelectorProps {
  selectedDataset?: string;
  onDatasetSelected: (datasetName: string) => void;
}
export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  selectedDataset,
  onDatasetSelected,
}) => {
  const datasets = useMaticoSelector(state=>state.datasets.datasets)
  return (
    <Box direction="row" align='center' justify='between'>
      <Text> Data Source</Text>
      <Select
        options={Object.values(datasets)}
        value={datasets[selectedDataset]}
        valueKey={"name"}
        labelKey={"name"}
        onChange={({ value }) => onDatasetSelected(value.name)}
      />
    </Box>
  );
};
