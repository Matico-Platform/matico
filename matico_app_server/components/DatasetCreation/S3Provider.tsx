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
          onSubmit({ name: dataset.name, description: dataset.description, type: "signedS3Arrow", url: `/api/datasets/${dataset.id}` })
        }
      />
    </Flex>
  )
};

export const MaticoProvider: DatasetProvider = {
  name: "Matico Datasets",
  description: "Access your uploaded datasets on matico",
  component: MaticoImporter,
  parameterEditor: () => <h1>Not implemented</h1>,
};
