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
  const [name, setName] = useState<string>(file.name.split(".").slice(0,-1).join("."));
  const [description, setDescription] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const [dataPreview, setDataPreview] = useState<
    Array<{ [col: string]: any }> | undefined
  >(undefined);
  const [columns, setColumns] = useState<Array<string> | undefined>(undefined);

  const metadata = {
    name,
    description,
    geom_col:"wkb_geometry",
    id_col:"ogc_fid",
    import_params:{
      GeoJson:{}
    }
  }

  useEffect(() => {
    getJsonPreview(file).then((batch) => {
      const data = batch.data
        .map((d: any) => d.properties)
        .filter((d: any) => d);
      const columns = data.reduce(
        (colSet: Set<string>, row: { [col: string]: any }) =>
          new Set([...colSet, ...Object.keys(row)]),
        new Set()
      );
      console.log("columns ", columns, " data ", data);
      setDataPreview(data);
      setColumns(Array.from(columns));
    });
  }, []);

  return (
    <View>
      {dataPreview && columns && (
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
                  {columns.map((column: string) => (
                    <Cell>{row[column]}</Cell>
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
          <Uploader file={file} metadata={{ name, description, import_params:{GeoJson:{}} }} />
        ) : (
          <Button variant="cta" onPress={() => setUpload(true)}>
            Upload
          </Button>
        )}
      </Form>
    </View>
  );
};
