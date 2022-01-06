import {
  ActionButton,
  Form,
  Switch,
  TextField,
  View,
  TableView,
  TableHeader,
  Column,
  TableBody,
  Text,
  Row,
  Cell,
  Flex,
  Picker,
  Item,
  Radio,
  RadioGroup,
  Button,
} from "@adobe/react-spectrum";
import React, { useState, useEffect, Key } from "react";
import { Uploader } from "./Uploader";
import { getCSVPreview } from "./utils/getCSVPreview";

export interface FilePreviewerProps {
  file: File;
  onSubmit?: () => void;
}

export const FilePreviewer: React.FC<FilePreviewerProps> = ({ file }) => {
  const [name, setName] = useState(file.name);
  const [isPublic, setIsPublic] = useState(true);
  const [geoType, setGeoType] = useState("none");
  const [dataPreview, setDataPreview] = useState<any | null>(null);
  const [columns, setColumns] = useState<Array<string>>([]);
  const [parseError, setParseError] = useState<any | null>(null);
  const [upload, setUpload] = useState(false);
  const [latCol, setLatCol] = useState<string | undefined>(undefined);
  const [lngCol, setLngCol] = useState<string | undefined>(undefined);
  const [wkbCol, setWKBCol] = useState<string | undefined>(undefined);

  let GeomSelector = <></>;

  console.log("columns ", columns);

  if (geoType === "lat_lng") {
    GeomSelector = (
      <>
        <Picker
          selectedKey={latCol}
          onSelectionChange={(key: Key) => setLatCol(key as string)}
          label="Latitude Column"
        >
          {columns.map((column: string) => (
            <Item key={column}>{column}</Item>
          ))}
        </Picker>
        <Picker
          selectedKey={lngCol}
          onSelectionChange={(key: Key) => setLngCol(key as string)}
          label="Logitude Column"
        >
          {columns.map((column: string) => (
            <Item key={column}>{column}</Item>
          ))}
        </Picker>
      </>
    );
  }
  if (geoType === "wkb") {
    GeomSelector = (
      <>
        <Picker
          selectedKey={wkbCol}
          onSelectionChange={(key: Key) => setWKBCol(key as string)}
          label="WKB Column"
        >
          {columns.map((column: string) => (
            <Item key={column}>{column}</Item>
          ))}
        </Picker>
      </>
    );
  }
  useEffect(() => {
    if (file.type.includes("csv")) {
      getCSVPreview(file)
        .then((data: any) => {
          if (data.data.length > 0) {
            setDataPreview(data.data);
            setColumns(Object.keys(data.data[0]));
          }
          if (data.errors.length > 0) {
            setParseError(data.errors[0].message);
          }
        })
        .catch((error) => setParseError(error));
    }
  }, []);

  if (upload) {
    return <Uploader file={file} metadata={{ name, latCol, lngCol }} />;
  }

  return (
    <Flex direction="column" width="100%" height="100%">
      {dataPreview && (
        <TableView height="size-1700">
          <TableHeader>
            {Object.keys(dataPreview[0]).map((column) => (
              <Column key={column}>{column}</Column>
            ))}
          </TableHeader>
          <TableBody>
            {dataPreview.map((row: { [colName: string]: any }) => {
              console.log("row is ", row);
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
      {parseError && <Text>{parseError.toString()}</Text>}
      <Form>
        <TextField
          label="Dataset Name"
          value={name}
          onChange={setName}
        ></TextField>
        <Switch isSelected={isPublic} onChange={setIsPublic}>
          Public
        </Switch>
        {dataPreview && (
          <>
            <RadioGroup
              orientation="horizontal"
              value={geoType}
              onChange={setGeoType}
              label="Geometry"
            >
              <Radio key="none" value="none">
                None
              </Radio>
              <Radio key="wkb" value="wkb">
                WKB
              </Radio>
              <Radio key="lat_lng" value="lat_lng">
                Lat/Lng
              </Radio>
            </RadioGroup>
            {GeomSelector}
          </>
        )}
        <Button variant="cta" onPress={() => setUpload(true)}>Upload</Button>
      </Form>
    </Flex>
  );
};
