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

  return (
    <Box direction="row">
      <Text>{label}</Text>
      {foundDataset ? (
        <Select
          options={foundDataset.columns() as any}
          value={selectedColumn}
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
