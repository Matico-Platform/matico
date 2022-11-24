import {
  Button,
  Cell,
  Column,
  Flex,
  Form,
  Item,
  Row,
  Switch,
  TableBody,
  TableHeader,
  TableView,
  TextArea,
  TextField,
  Picker,
  View,
} from "@adobe/react-spectrum";
import { Dataset } from "@prisma/client";
import React, { useEffect, useState } from "react";

import { Uploader } from "./Uploader";
import { useLoadDataset } from "./useLoadDataset";

export interface FilePreviewerInterface {
  file: File;
  onSubmit?: (dataset: Dataset & { dataUrl: string }) => void;
}

export const FilePreviewer: React.FC<FilePreviewerInterface> = ({
  file,
  onSubmit,
}) => {
  const [name, setName] = useState<string>(
    file.name.split(".").slice(0, -1).join(".")
  );
  const [description, setDescription] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const [showGeomMaker, setGeomMaker] = useState<boolean>(false);
  const [latColumn, setLatColumn] = useState<string | undefined>(undefined);
  const [lngColumn, setLngColumn] = useState<string | undefined>(undefined);

  const { data, fileType } = useLoadDataset(file, latColumn, lngColumn);

  return (
    <Flex width="100%" height="100%" direction="column">
      {data && (
        <TableView height="size-2400">
          <TableHeader>
            {data._names.map((column) => (
              <Column key={column}>{column}</Column>
            ))}
          </TableHeader>
          <TableBody>
            {data
              .objects({ limit: 20 })
              .map((row: { [colName: string]: any }, index) => (
                <Row>
                  {data._names.map((name: string) => {
                    const val =
                      typeof row[name] === "object" ? "data" : row[name];
                    return <Cell>{val}</Cell>;
                  })}
                </Row>
              ))}
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
        <Switch
          isDisabled={upload}
          isSelected={isPublic}
          onChange={(val) => setIsPublic(val)}
        >
          Public
        </Switch>

        {fileType === "csv" && (
          <Switch
            aria-label="Add geometry"
            isSelected={showGeomMaker}
            onChange={setGeomMaker}
          >
            Add geometry
          </Switch>
        )}

        {showGeomMaker && (
          <Flex
            direction="row"
            width="100%"
            justifyContent="space-evenly"
            gap={"size-400"}
          >
            <Picker
              flex={1}
              label={"Latitude"}
              items={data._names.map((column) => ({
                id: column,
                name: column,
              }))}
              selectedKey={latColumn}
              onSelectionChange={(column) => setLatColumn(column as string)}
            >
              {(item) => <Item key={item.id}>{item.name} </Item>}
            </Picker>
            <Picker
              flex={1}
              label={"Longitude"}
              items={data._names.map((column) => ({
                id: column,
                name: column,
              }))}
              selectedKey={lngColumn}
              onSelectionChange={(column) => setLngColumn(column as string)}
            >
              {(item) => <Item key={item.id}>{item.name} </Item>}
            </Picker>
          </Flex>
        )}

        {upload && data ? (
          <Uploader
            table={data}
            metadata={{ name, description, public: isPublic }}
            onDone={(dataset) => {
              if (onSubmit) {
                onSubmit(dataset);
              }
            }}
          />
        ) : (
          <Button
            variant="cta"
            onPress={() => setUpload(true)}
            isDisabled={
              !(!showGeomMaker || (showGeomMaker && latColumn && lngColumn))
            }
          >
            Upload
          </Button>
        )}
      </Form>
    </Flex>
  );
};
