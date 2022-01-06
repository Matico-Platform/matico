import {
  Button,
  Form,
  Switch,
  TextArea,
  TextField,
  View,
} from "@adobe/react-spectrum";
import React, { useState } from "react";

import { FilePreviewerInterface } from "./FilePreviewerInterface";
import { Uploader } from "./Uploader";

export const GeoJSONFilePreviewer: React.FC<FilePreviewerInterface> = ({
  file,
  onSubmit,
}) => {
  const [name, setName] = useState<string>(file.name);
  const [description, setDescription] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);

  return (
    <View>
      <Form>
        <TextField
          isDisabled={upload}
          label="Name"
          value={name}
          onChange={setName}
        />
        <TextArea
          isDisabled={upload}
          label="Description"
          value={description}
          onChange={setDescription}
        />
        <Switch isDisabled={upload} isSelected={isPublic}>
          Public
        </Switch>
        {upload ? (
          <Uploader file={file} metadata={{ name, description }} />
        ) : (
          <Button variant="cta" onPress={() => setUpload(true)}>
            Upload
          </Button>
        )}
      </Form>
    </View>
  );
};
