import React, { useState } from "react";
import { useApis } from "../hooks/useApis";
import { useDatasetData } from "../hooks/useDatasetData";
import {
  Item,
  Picker,
  View,
  Text,
  ActionButton,
  Switch,
} from "@adobe/react-spectrum";

import {
  DatasetProvider,
  DatasetRecord,
  DatasetProviderComponent,
} from "@maticoapp/matico_components";
import Variable from "@spectrum-icons/workflow/Variable";
import { VariableEditor } from "../components/VariableEditor";

export const MaticoApiExplorer: React.FC<DatasetProviderComponent> = ({
  onSubmit,
}) => {
  const { apis, error } = useApis();
  const [selectedApiID, setSelectedApiID] = useState<any | null>(null);
  const [values, setValues] = useState<{[param:string]:any}>({})

  const selectedApi = apis
    ? apis.find((api: any) => api.id === selectedApiID)
    : null;
  const { data, error: dataError } = useDatasetData(selectedApiID, 0);

  const submitDataset = () => {
    const spec = {
      MaticoApi: {
        name: selectedApi.name,
        description: selectedApi.description,
        server_url: "/api",
        api_id: selectedApi.id,
        params: values
      },
    };
    onSubmit(spec);
  };

  return (
    <View>
      {apis && (
        <Picker
          label="apis"
          items={apis}
          selectedKey={selectedApiID}
          onSelectionChange={setSelectedApiID}
        >
          {(api: any) => <Item key={api.id}>{api.name}</Item>}
        </Picker>
      )}
      {selectedApi && (
        <>
          <VariableEditor
            parameters={selectedApi.parameters}
            onParametersChanged={(newParams) => console.log(newParams)}
            editable={false}
            values ={values}
            onValuesChanged={setValues}
          />
          <ActionButton onPress={submitDataset}>Add Api</ActionButton>
        </>
      )}
    </View>
  );
};

export const MaticoServerApiProvider: DatasetProvider = {
  name: "Matico Apis",
  description: "Use an api defined on matico",
  component: MaticoApiExplorer,
};
