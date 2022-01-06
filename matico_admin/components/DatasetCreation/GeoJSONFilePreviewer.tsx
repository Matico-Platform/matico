import {
  Button,
  Cell,
  Column,
  Form,
  Row,
  Switch,
  TableBody,
  TableHeader,
  TableView,
  TextArea,
  TextField,
  View,
} from "@adobe/react-spectrum";
import React, { useEffect, useState } from "react";

import { FilePreviewerInterface } from "./FilePreviewerInterface";
import { Uploader } from "./Uploader";
import { getJsonPreview } from "./utils/getJsonPreview";

export const GeoJSONFilePreviewer: React.FC<FilePreviewerInterface> = ({
  file,
  onSubmit,
}) => {
  const [name, setName] = useState<string>(file.name);
  const [description, setDescription] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const [dataPreview, setDataPreview] = useState<
    Array<{ [col: string]: any }> | undefined
  >(undefined);
  const [columns, setColumns] = useState<Array<string> | undefined>(undefined);

  useEffect(() => {
    getJsonPreview(file).then((batch) => {
      const data = batch.data.map((d: any) => d.properties);
      const columns = Object.keys(data[0]);
      setDataPreview(data);
      setColumns(columns);
    });
  }, []);

  return (
    <View>
      {dataPreview && (
        <TableView height="size-2400">
          <TableHeader>
            {Object.keys(dataPreview[0]).map((column) => (
              <Column key={column}>{column}</Column>
            ))}
          </TableHeader>
          <TableBody>
            {dataPreview.map((row: { [colName: string]: any }) => {
              return (
                <Row>
                  {Object.values(row).map((value: any) => (
                    <Cell>{value}</Cell>
                  ))}
                </Row>
              );
            })}
          </TableBody>
        </TableView>
      )}
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
