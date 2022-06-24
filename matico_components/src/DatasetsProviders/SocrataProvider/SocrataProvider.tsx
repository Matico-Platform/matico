import React, { Key, useState } from "react";
import {
  Item,
  Picker,
  View,
  Text,
  Flex,
  ComboBox,
  Well,
  Link,
  ProgressBar,
  Button,
  Heading,
} from "@adobe/react-spectrum";

import {
  DatasetProviderComponent,
  DatasetProvider,
} from "Datasets/DatasetProvider";

import { PortalInfo, usePortals } from "./usePortals";
import { usePortalDatasets } from "./usePortalDatasets";

export const SocrataDatasetExplorer: React.FC<DatasetProviderComponent> = ({
  onSubmit,
}) => {
  const portals = usePortals();

  const [selectedPortalKey, setSelectedPortalKey] =
    useState<null | string>(null);

  const [selectedDatasetId, setSelectedDatasetId] =
    useState<null | string>(null);

  const [latitudeCol, setLatitudeCol] = useState<string | null>(null);
  const [longitudeCol, setLongitudeCol] = useState<string | null>(null);

  const selectedPortal = portals
    ? portals.find(
        (p: PortalInfo) => p.domain === (selectedPortalKey as string)
      )
    : null;

  const { datasets, loading, progress } = usePortalDatasets(selectedPortal);

  const selectedDataset = datasets
    ? datasets.find((d) => d.resource.id === selectedDatasetId)
    : null;

  const attemptToLoadDataset = (dataset: any, format: "CSV" | "GeoJSON") => {
    if(format==='GeoJSON'){
      onSubmit({
          type:'geoJSON',
          url: `https://${dataset.metadata.domain}/api/geospatial/${dataset.resource.id}?method=export&format=GeoJSON`,
          name: dataset.resource.name,
      });
    }
    else{
      onSubmit({
          type: 'csv',
          url: `https://${dataset.metadata.domain}/api/views/${dataset.resource.id}/rows.csv?accessType=DOWNLOAD`,
          name: dataset.resource.name,
          lat_col: latitudeCol,
          lng_col: longitudeCol
      });

    }
  };

  console.log("selected dataset ", selectedDataset);
  return (
    <Flex direction="column" gap="size-200" padding="size-100">
      {portals && (
        <ComboBox
          label="Select Portal"
          placeholder="Select a socrata portal to get data from"
          width="100%"
          defaultItems={portals.slice(0, 100)}
          selectedKey={selectedPortalKey}
          onSelectionChange={(key) => setSelectedPortalKey(key as string)}
        >
          {(portal) => (
            <Item key={portal.domain}>
              <Text>{portal.domain}</Text>
              <Text slot="description">{portal.count} datasets</Text>
            </Item>
          )}
        </ComboBox>
      )}

      {loading && (
        <ProgressBar label="Getting datasets" width="100%" value={progress} />
      )}
      {datasets && (
        <ComboBox
          defaultItems={datasets}
          width="100%"
          placeholder="Select dataset"
          label="Datasets"
          selectedKey={selectedDatasetId}
          onSelectionChange={setSelectedDatasetId}
        >
          {(dataset) => (
            <Item key={dataset.resource.id}>{dataset.resource.name}</Item>
          )}
        </ComboBox>
      )}

      {selectedDataset && (
        <Well>
          <Flex direction="column">
            <View overflow="hidden auto" maxHeight="size-2000">
              <Text>{selectedDataset.resource.description}</Text>
            </View>
            <Flex marginTop="size-200" justifyContent="space-between">
              <Link>
                <a target="_blank" href={selectedDataset.permalink}>
                  View on portal
                </a>
              </Link>
              <Text>{selectedDataset.owner.display_name}</Text>
            </Flex>
          </Flex>
        </Well>
      )}
      {selectedDataset && (
        <Well>
          <Heading>Columns</Heading>
          <View maxHeight="size-2000" overflow="hidden auto">
            <Flex direction="column">
              {selectedDataset.resource.columns_name.map(
                (name: string, index: number) => (
                  <Flex
                    direction="row"
                    justifyContent="space-between"
                    margin="size-100"
                  >
                    <Text>{name}</Text>
                    <Text>
                      {selectedDataset.resource.columns_datatype[index]}{" "}
                    </Text>
                  </Flex>
                )
              )}
            </Flex>
          </View>
        </Well>
      )}
      {selectedDataset &&
      selectedDataset.resource.lens_view_type &&
      selectedDataset.resource.lens_view_type === "geo" ? (
        <Flex direction="row" justifyContent="end">
          <Button
            onPress={() => attemptToLoadDataset(selectedDataset, "GeoJSON")}
            variant="cta"
          >
            Load Dataset
          </Button>
        </Flex>
      ) : (
        selectedDataset && (
          <Flex direction="row" justifyContent="end">
            <Picker
              label="Latitude Column"
              selectedKey={latitudeCol}
              onSelectionChange={setLatitudeCol}
              items={selectedDataset.resource.columns_name.map((c) => ({
                id: c,
                name: c,
              }))}
            >
              {(item) => <Item key={item.id}>{item.name}</Item>}
            </Picker>
            <Picker
              label="Longitude Column"
              selectedKey={longitudeCol}
              onSelectionChange={setLongitudeCol}
              items={selectedDataset.resource.columns_name.map((c) => ({
                id: c,
                name: c,
              }))}
            >
              {(item) => <Item key={item.id}>{item.name}</Item>}
            </Picker>
            <Button
              onPress={() => attemptToLoadDataset(selectedDataset, "CSV")}
              variant="cta"
              isDisabled={!(latitudeCol && longitudeCol)}
            >
              Load Dataset
            </Button>
          </Flex>
        )
      )}
    </Flex>
  );
};

export const SocrataDatasetProvider: DatasetProvider = {
  name: "Socrata Datasets",
  description: "Import a datasets from socrata",
  component: SocrataDatasetExplorer,
};
