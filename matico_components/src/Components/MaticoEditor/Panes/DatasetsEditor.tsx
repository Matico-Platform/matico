import {
  Accordion,
  AccordionPanel,
  Box,
  Button,
  Form,
  FormField,
  List,
  Tab,
  Tabs,
  Text,
  TextInput,
} from "grommet";
import { Columns, Edit, FormTrash } from "grommet-icons";
import React, { useContext, useState } from "react";
import { MaticoDataContext } from "Contexts/MaticoDataContext/MaticoDataContext";
import { Dataset, DatasetState } from "Datasets/Dataset";
import { useMaticoDispatch } from "Hooks/redux";
import { addDataset } from "Stores/MaticoSpecSlice";
import styled from "styled-components";

interface DatasetEditorProps {
  dataset: Dataset;
  status: DatasetState;
}

const StyledAccordion = styled(Accordion)`
  button {
    border: none !important;
    box-shadow: none !important;
  }
`;

const StyledAccordionPanel = styled(AccordionPanel)`
  button {
    border: none !important;
  }
`;

export const DatasetEditor: React.FC<DatasetEditorProps> = ({
  dataset,
  status,
}) => {
  let statusColors = {
    [DatasetState.LOADING]: "status-warning",
    [DatasetState.ERROR]: "status-warning",
    [DatasetState.READY]: "status-ok",
  };

  return (
    <Box
      direction="row"
      gap="small"
      hoverIndicator="light-1"
      align="center"
      pad="medium"
    >
      <Box flex>
        <Text textAlign="start" color={statusColors[status]}>
          {dataset.name}
        </Text>
      </Box>
      <Text>{dataset.geometryType()}</Text>
      <Text>{dataset.columns().length}</Text>
      <Columns />
      <Button icon={<Edit color={"status-warning"} />} />
      <Button icon={<FormTrash color={"status-critical"} />} />
    </Box>
  );
};

interface NewDatasetInputProps {
  onCancel: () => void;
  onSubmit: (datasetParams: any) => void;
}

const NewDatasetInput: React.FC<NewDatasetInputProps> = ({
  onCancel,
  onSubmit,
}) => {
  return (
    <Box pad="medium">
      <Tabs>
        <Tab title="CSV">
          <Form
            onSubmit={({ value }) => {
              onSubmit({ CSV: value });
            }}
          >
            <FormField label="url" name="url" htmlFor={"url"}>
              <TextInput name="url" id="url" />
            </FormField>
            <FormField label="name" name="name" htmlFor={"name"}>
              <TextInput name="name" id="name" />
            </FormField>
            <FormField
              label="Longitude Column"
              name="lng_col"
              htmlFor={"lng_col"}
            >
              <TextInput name="lng_column" id="lng_col" />
            </FormField>
            <FormField
              label="Latitude Column"
              name="lat_col"
              htmlFor={"lat_col"}
            >
              <TextInput name="lat_col" id="lat_col" />
            </FormField>
            <Box direction="row" justify="between">
              <Button label="Cancel" onClick={onCancel} />
              <Button label="Create" type="submit" />
            </Box>
          </Form>
        </Tab>
        <Tab title="GeoJSON">
          <Form
            onSubmit={({ value }) => {
              onSubmit({ GeoJSON: value });
            }}
          >
            <FormField label="url" name="url" htmlFor={"url"}>
              <TextInput name="url" id="url" />
            </FormField>
            <FormField label="name" name="name" htmlFor={"name"}>
              <TextInput name="name" id="name" />
            </FormField>
            <Box direction="row" justify="between">
              <Button label="Cancel" onClick={onCancel} />
              <Button label="Create" type="submit" />
            </Box>
          </Form>
        </Tab>
      </Tabs>
    </Box>
  );
};

export const DatasetsEditor: React.FC = () => {
  const { state } = useContext(MaticoDataContext);
  const { datasets, datasetStates } = state;
  const [showNewDataset, setShowNewDataset] = useState(false);

  const dispatch = useMaticoDispatch();

  const createDataset = (details: any) => {
    dispatch(addDataset({ dataset: details }));
    setShowNewDataset(false);
  };

  return (
    <Box background="white" fill gap="medium" pad={{ bottom: "small" }}>
      {showNewDataset ? (
        <NewDatasetInput
          onCancel={() => setShowNewDataset(false)}
          onSubmit={createDataset}
        />
      ) : (
        <Box>
          <StyledAccordion multiple={false}>
            {datasets.map((dataset) => {
              return (
                <StyledAccordionPanel
                  key={dataset.name}
                  header={() => (
                    <Box>
                      <DatasetEditor
                        dataset={dataset}
                        key={dataset.name}
                        status={datasetStates[dataset.name]}
                      />
                    </Box>
                  )}
                >
                  <List data={dataset.columns()}>
                    {(column, index) => (
                      <Box key={index}>
                        {column.name} : {column.type}
                      </Box>
                    )}
                  </List>
                </StyledAccordionPanel>
              );
            })}
          </StyledAccordion>
          <Button
            label={"Add Dataset"}
            onClick={() => setShowNewDataset(true)}
          />
        </Box>
      )}
    </Box>
  );
};
