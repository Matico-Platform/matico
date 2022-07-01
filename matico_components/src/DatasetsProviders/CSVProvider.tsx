import { Flex, TextField, Button } from "@adobe/react-spectrum";
import {
  DatasetProviderComponent,
  DatasetProvider,
} from "Datasets/DatasetProvider";
import React, {useState} from "react";

export const CSVImporter: React.FC<DatasetProviderComponent> = ({
  onSubmit,
}) => {
  const [options, setOptions] = useState<{url:string, name:string, lat_col:string, lng_col:string}>({
    url: "",
    name: "",
    lat_col: "",
    lng_col: "",
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
      <TextField
        width="100%"
        label="latitude column"
        value={options.lat_col}
        onChange={(lat_col) => updateOptions({ lat_col })}
      />
      <TextField
        width="100%"
        label="longitude column"
        value={options.lng_col}
        onChange={(lng_col) => updateOptions({ lng_col })}
      />
      <Button variant="cta" onPress={() => onSubmit({ "type": "csv",  ...options })}>Submit</Button>
    </Flex>
  );
};

export const CSVProvider: DatasetProvider = {
  name: "CSV Dataset",
  description: "Import a CSV from a public url",
  component: CSVImporter,
  parameterEditor: ()=> <h1>Not implemented</h1>
};
