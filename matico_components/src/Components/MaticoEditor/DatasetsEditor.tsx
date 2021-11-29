import { Box, Button, List, Text } from "grommet";
import React, { useContext } from "react";
import { MaticoDataContext } from "../../Contexts/MaticoDataContext/MaticoDataContext";
import { Dataset, DatasetState } from "../../Datasets/Dataset";
import { Columns, Edit, FormTrash} from "grommet-icons";


interface DatasetEditorProps {
  dataset: Dataset;
  status: DatasetState;
}

export const DatasetEditor: React.FC<DatasetEditorProps> = ({
  dataset,
  status,
}) => {
  return (
    <Box direction="row" gap="small" hoverIndicator="light-1" align="center">
      <Box flex>
        <Text textAlign="start">{dataset.name}</Text>
      </Box>
      <Text>{dataset.geometryType()}</Text>
      <Text>{dataset.columns().length}</Text>
      <Columns />
      <Button icon={<Edit color={'status-warning'} />}/>
      <Button icon={<FormTrash color={'status-critical'} />}/>
    </Box>
  );
};

export const DatasetsEditor: React.FC = () => {
  const { state } = useContext(MaticoDataContext);
  const { datasets, datasetStates } = state;

  return (
    <Box background="white" fill gap="medium" pad={{ bottom: "small" }}>
      <List data={datasets}>
        {(dataset, index) => {
          return (
            <DatasetEditor
              dataset={dataset}
              key={dataset.name}
              status={datasetStates[dataset.name]}
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
