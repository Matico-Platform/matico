import { Flex, TextField, Button } from "@adobe/react-spectrum";
import React, {useState} from "react";
import {DatasetProvider,DatasetProviderComponent} from "@maticoapp/matico_components/dist/Datasets/DatasetProvider"

export const MaticoImporter: React.FC<DatasetProviderComponent> = ({
  onSubmit,
}) => {


  return (
    <Flex direction="column" gap="size-200">
      
      <Button variant="cta" onPress={() => onSubmit({ "type": "arrow"})}>Submit</Button>
    </Flex>
  );
};

export const MaticoProvider: DatasetProvider = {
  name: "Matico Datasets",
  description: "Access your uploaded datasets on matico",
  component: MaticoImporter,
  parameterEditor: ()=> <h1>Not implemented</h1>
};
