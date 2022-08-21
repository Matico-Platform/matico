import { Flex, TextField, Button } from "@adobe/react-spectrum";
import React, { useState } from "react";
import {
  DatasetProvider,
  DatasetProviderComponent,
} from "@maticoapp/matico_components/dist/Datasets/DatasetProvider";
import { DatasetSelector } from "../DatasetSelector/DatasetSelector";

export const MaticoImporter: React.FC<DatasetProviderComponent> = ({
  onSubmit,
}) => {
  return (
    <Flex direction="column" gap="size-200">
      <DatasetSelector
        onSelectDataset={(dataset) =>
          onSubmit({ name: dataset.name, description: dataset.description, type: "signedS3Arrow", url: `${window.origin}/api/datasets/${dataset.id}` })
        }
      />
    </Flex>
  )
};

export const MaticoProvider: DatasetProvider = {
  name: "Your datasets",
  description: "Add a dataset you have uploaded to matico",
  component: MaticoImporter,
  parameterEditor: () => <h1>Not implemented</h1>,
};
