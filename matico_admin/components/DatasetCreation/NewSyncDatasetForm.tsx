import { Form, Switch, TextField, Flex, View, NumberField, Button, TextArea } from "@adobe/react-spectrum";
import React, { useState } from "react";
import {createSyncDataset} from "../../utils/api";

export interface NewSyncDatasetFormProps {}
export const NewSyncDatasetForm: React.FC<NewSyncDatasetFormProps> = () => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [updateFrequency, setUpdateFrequency] = useState(10)
  const [error,setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean> (false)
  const [success, setSuccess] = useState<boolean> (false)

  const attemptCreateSyncDataset = ()=>{
    setLoading(true)
    createSyncDataset({
      name,
      sync_url:url,
      description,
      public:isPublic,
      sync_frequency_seconds:updateFrequency*60
    }).then(()=>{
      setSuccess(true)
    }) 
    .catch((error)=>{
      setLoading(false)
      setError(error)
    })
  }

  return (
    <Flex
      direction="column"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <View>
        <h3>Create a Dataset that will sync from an external source</h3>
        <Form isDisabled={loading}>
          <TextField label="url" key="url" value={url} onChange={setUrl} />
          <TextField label="name" key="name" value={name} onChange={setName} />
          <TextArea label="description" key="description" value={description} onChange={setDescription} />
          <Switch key="public" isSelected={isPublic} onChange={setIsPublic}>
            Public
          </Switch>
          <NumberField label="Update Frequency (mins)" value={updateFrequency} onChange={setUpdateFrequency} />

          <Button variant='cta' onPress={attemptCreateSyncDataset}>Submit</Button>
        </Form>
      </View>
    </Flex>
  );
};
