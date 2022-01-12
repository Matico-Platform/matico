import React, { useState } from "react";
import { useDatasets } from "../hooks/useDatasets";
import { useDatasetData } from "../hooks/useDatasetData";
import { Item, Picker, View, Text, ActionButton } from "@adobe/react-spectrum";

import {
  DatasetProvider,
  DatasetRecord,
  DatasetProviderComponent,
} from "@maticoapp/matico_components";

export const MaticoDatasetExplorer: React.FC<DatasetProviderComponent> = ({
  onSubmit,
}) => {
  const { data: datasets, error } = useDatasets();
  const [selectedDatasetID, setSelectedDatasetID] = useState<any | null>(null);
  const selectedDataset = datasets
    ? datasets.find((d) => d.id === selectedDatasetID)
    : null;
  const { data, error: dataError } = useDatasetData(selectedDatasetID, 0);

  const submitDataset = () => {
    onSubmit({
      GeoJSON: {
        url: `${window.location.origin}/api/datasets/${selectedDatasetID}/data?format=geojson`,
        name: selectedDataset.name,
      },
    });
  };

  return (
    <View>
      {datasets && (
        <Picker
          label="dataset"
          items={datasets}
          selectedKey={selectedDatasetID}
          onSelectionChange={setSelectedDatasetID}
        >
          {(dataset: any) => <Item key={dataset.id}>{dataset.name}</Item>}
        </Picker>
      )}
      {selectedDataset && (
        <ActionButton onPress={submitDataset}>Add Datasets</ActionButton>
      )}
    </View>
  );
};

export const MaticoServerDatasetProvider: DatasetProvider = {
  name: "Matico Datasets",
  description: "Import your datasets from matico",
  component: MaticoDatasetExplorer,
};
