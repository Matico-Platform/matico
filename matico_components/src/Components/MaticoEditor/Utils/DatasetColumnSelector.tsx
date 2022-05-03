import React from "react";
import { useMaticoSelector } from "Hooks/redux";
import { Picker, Item } from "@adobe/react-spectrum";
import { Column } from "Datasets/Dataset";

interface DatasetColumnSelectorProps {
  datasetName?: string;
  selectedColumn?: Column | null;
  onColumnSelected: (column: Column) => void;
  label?: string;
  description?:string
}
export const DatasetColumnSelector: React.FC<DatasetColumnSelectorProps> = ({
  datasetName,
  selectedColumn,
  label = "Column",
  description,
  onColumnSelected,
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
      description={description}
      isDisabled={!datasetName}
      selectedKey={selectedColumn?.name}
      onSelectionChange={(column) =>
        onColumnSelected(columns.find((c) => c.name === column))
      }
    >
      {(column) => <Item key={column.name}>{column.name}</Item>}
    </Picker>
  );
};
