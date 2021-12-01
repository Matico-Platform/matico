import { Text, Box, Select } from "grommet";
import React, { useContext } from "react";
import { MaticoDataContext } from "../../Contexts/MaticoDataContext/MaticoDataContext";

interface DatasetSelectorProps {
  selectedDataset?: string;
  onDatasetSelected: (datasetName: string) => void;
}
export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  selectedDataset,
  onDatasetSelected,
}) => {
  const { state } = useContext(MaticoDataContext);
  return (
    <Box direction="row" align='center' justify='between'>
      <Text> Data Source</Text>
      <Select
        options={state.datasets}
        value={state.datasets.find((d) => d.name === selectedDataset)}
        valueKey={"name"}
        labelKey={"name"}
        onChange={({ value }) => onDatasetSelected(value.name)}
      />
    </Box>
  );
};
