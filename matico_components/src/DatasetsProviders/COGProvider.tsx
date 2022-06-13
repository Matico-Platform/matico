import { Flex, TextField, Button } from "@adobe/react-spectrum";
import {
  DatasetProviderComponent,
  DatasetProvider,
} from "Datasets/DatasetProvider";
import React, {useState} from "react";

export const COGImporter: React.FC<DatasetProviderComponent> = ({
  onSubmit,
}) => {
  const [options, setOptions] = useState({
    url: "",
    name: ""
  });

  const updateOptions = (update: { [option: string]: string }) => {
    setOptions({ ...options, ...update });
  };

  return (
    <Flex direction="column" gap="size-200">
      <TextField
        width="100%"
        label="url"
        value={options.url}
        onChange={(url) => updateOptions({ url })}
      />
      <TextField
        width="100%"
        label="name"
        value={options.name}
        onChange={(name) => updateOptions({ name })}
      />
      <Button variant="cta" onPress={() => onSubmit({ COG: options })}>Submit</Button>
    </Flex>
  );
};

export const COGProvider: DatasetProvider = {
  name: "COG Dataset",
  description: "Setup a COG tile layer from a public url",
  component: COGImporter,
  parameterEditor: ()=><h1>NOt Implemented</h1>
};
