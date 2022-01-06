import { Form, Switch, Heading, TextField, View } from "@adobe/react-spectrum";
import React, { useState } from "react";

export interface NewSyncDatasetFormProps {}
export const NewSyncDatasetForm: React.FC<NewSyncDatasetFormProps> = () => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  return (
    <View>
      <h3>Create a Dataset that will sync from an external source</h3>
      <Form>
        <TextField label="url" key="url" value={url} onChange={setUrl} />
        <TextField label="name" key="url" value={name} onChange={setName} />
        <Switch key="public" isSelected={isPublic} onChange={setIsPublic}>
          Public
        </Switch>
      </Form>
    </View>
  );
};
