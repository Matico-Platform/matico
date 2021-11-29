import { Box, Button, List, Text } from "grommet";
import React, { useContext } from "react";
import { MaticoDataContext } from "../../Contexts/MaticoDataContext/MaticoDataContext"
import { Dataset, DatasetState } from "../../Datasets/Dataset";

interface DatasetEditorProps {
  dataset: Dataset;
  status: DatasetState;
}

export const DatasetEditor: React.FC<DatasetEditorProps> = ({
  dataset,
  status,
}) => {
  return (
    <Box direction="row" justify="between">
      <Text>{dataset.name}</Text>
      <Text>{dataset.columns().length}</Text>
      <Text>{dataset.geometryType}</Text>
    </Box>
  );
};

export const DatasetsEditor: React.FC = () => {
  const { state } = useContext(MaticoDataContext);
  const { datasets, datasetStates } = state;

  return (
    <Box background='white' fill>
      <List data={datasets}>
        {(dataset, index) => {
          return (
            <DatasetEditor
              dataset={dataset}
              key={dataset.name()}
              status={datasetStates[dataset.name()]}
            />
          );
        }}
      </List>
      <Box>
        <Button label={"Add Dataset"} />
      </Box>
    </Box>
  );
};
