import { Text, Box, Select } from "grommet";
import React, { useContext } from "react";
import { MaticoDataContext } from "../../Contexts/MaticoDataContext/MaticoDataContext";

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
  const { state } = useContext(MaticoDataContext);
  const foundDataset = state.datasets.find((d) => d.name === dataset);
  const columns = foundDataset.columns()
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
