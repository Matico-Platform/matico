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
import {
  Column,
  Dataset,
  DatasetState,
  DatasetSummary,
} from "Datasets/Dataset";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import { addDataset } from "Stores/MaticoSpecSlice";
import styled from "styled-components";
import { DatasetProvider } from "Datasets/DatasetProvider";

interface DatasetEditorProps {
  dataset: DatasetSummary;
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
        <Text textAlign="start" color={statusColors[dataset.state]}>
          {dataset.name}
        </Text>
      </Box>
      {dataset.state === DatasetState.READY ? (
        <>
          <Text>{dataset.geomType}</Text>
          <Text>{dataset.columns.length}</Text>
          <Columns />
        </>
      ) : (
        <Text>Loading</Text>
      )}
      <Button icon={<Edit color={"status-warning"} />} />
      <Button icon={<FormTrash color={"status-critical"} />} />
    </Box>
  );
};

interface NewDatasetInputProps {
  onCancel: () => void;
  onSubmit: (datasetParams: any) => void;
  datasetProviders?: Array<DatasetProvider>;
}

const NewDatasetInput: React.FC<NewDatasetInputProps> = ({
  onCancel,
  datasetProviders,
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
        {datasetProviders &&
          datasetProviders.map((provider: DatasetProvider) => (
            <Tab title={provider.name} key={provider.name}>
              <provider.component
                onSubmit={(selectedDataset: any) => onSubmit(selectedDataset)}
              />
            </Tab>
          ))}
      </Tabs>
    </Box>
  );
};

interface DatasetsEditorProps {
  datasetProviders?: Array<DatasetProvider>;
}

export const DatasetsEditor: React.FC<DatasetsEditorProps> = ({
  datasetProviders,
}) => {
  const { datasets } = useMaticoSelector((s) => s.datasets);
  const [showNewDataset, setShowNewDataset] = useState(false);

  const dispatch = useMaticoDispatch();

  const createDataset = (details: any) => {
    dispatch(addDataset({ dataset: details }));
    setShowNewDataset(false);
  };

  console.log("datasets are", datasets);

  return (
    <Box background="white" fill gap="medium" pad={{ bottom: "small" }}>
      {showNewDataset ? (
        <NewDatasetInput
          onCancel={() => setShowNewDataset(false)}
          onSubmit={createDataset}
          datasetProviders={datasetProviders}
        />
      ) : (
        <Box>
          <StyledAccordion multiple={false}>
            {Object.entries(datasets).map(([datasetName, dataset]) => {
              return (
                <StyledAccordionPanel
                  key={datasetName}
                  header={() => (
                    <Box>
                      <DatasetEditor
                        dataset={dataset}
                        key={datasetName}
                      />
                    </Box>
                  )}
                >
                  <List data={dataset.columns}>
                    {(column: Column) => (
                      <Box key={column.name}>
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
