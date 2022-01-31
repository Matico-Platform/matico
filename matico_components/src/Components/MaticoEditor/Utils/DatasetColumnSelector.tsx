import { Text, Box, Select } from "grommet";
import React, { useContext } from "react";
import { MaticoDataContext } from "Contexts/MaticoDataContext/MaticoDataContext";
import {useMaticoSelector} from "Hooks/redux";

interface DatasetColumnSelectorProps {
  dataset?: string;
  selectedColumn?: string;
  onColumnSelected: (datasetName: string) => void;
  label?: string;
}
export const DatasetColumnSelector: React.FC<DatasetColumnSelectorProps> = ({
  dataset,
  selectedColumn,
  label = "Column",
  onColumnSelected,
}) => {
  const foundDataset = useMaticoSelector(state=>state.datasets.datasets[dataset]);
  const columns =  foundDataset ? foundDataset.columns: []

  return (
    <Box direction="row" align="center" justify='between'>
      <Text>{label}</Text>
      {foundDataset ? (
        <Select
          options={columns}
          value={columns.find( c=>c.name === selectedColumn)}
          valueKey={"name"}
          labelKey={"name"}
          onChange={({ value }) => onColumnSelected(value.name)}
        />
      ) : (
        <Text>First select a dataset</Text>
      )}
    </Box>
  );
};
