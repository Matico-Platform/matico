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
  TextArea,
} from "@adobe/react-spectrum";
import React, { useState, useEffect, Key } from "react";
import { Uploader } from "./Uploader";
import { getCSVPreview } from "./utils/getCSVPreview";
import { FilePreviewerInterface } from "./FilePreviewerInterface";
import formatISO from 'date-fns/formatISO'


function valueFormatter(value : unknown){
  if( value instanceof Date ){
   return formatISO(value) 
  }
  else if ( typeof(value)==="object"){
    return JSON.stringify(value)
  }
  return value
}

export const CSVFilePreviewer: React.FC<FilePreviewerInterface> = ({
  file,
}) => {
  const [name, setName] = useState<string>(
    file.name.split(".").slice(0, -1).join(".")
  );
  const [description, setDescription] = useState("");
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

  if (geoType === "lat_lng") {
    GeomSelector = (
      <>
        <Picker
          selectedKey={latCol}
          onSelectionChange={(key: Key) => setLatCol(key as string)}
          label="Latitude Column"
          isDisabled={upload}
        >
          {columns.map((column: string) => (
            <Item key={column}>{column}</Item>
          ))}
        </Picker>
        <Picker
          selectedKey={lngCol}
          onSelectionChange={(key: Key) => setLngCol(key as string)}
          label="Logitude Column"
          isDisabled={upload}
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
  }
  console.log("Dataset preview ",dataPreview) 

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
              return (
                <Row>
                  {Object.values(row).map((value: any) => (
                    <Cell>{valueFormatter(value)}</Cell>
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
          isDisabled={upload}
        ></TextField>
        <TextArea
          label="Description"
          placeholder="Describe your datasets so that people know whats in it"
          value={description}
          onChange={setDescription}
          isDisabled={upload}
        ></TextArea>
        <Switch
          isDisabled={upload}
          isSelected={isPublic}
          onChange={setIsPublic}
        >
          Public
        </Switch>
        {dataPreview && (
          <>
            <RadioGroup
              orientation="horizontal"
              value={geoType}
              onChange={setGeoType}
              label="Geometry"
              isDisabled={upload}
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
        {upload ? (
          <Uploader
            file={file}
            metadata={{ name,  description, import_params: {Csv: {x_col: lngCol, y_col:latCol}}}}
          />
        ) : (
          <Button variant="cta" onPress={() => setUpload(true)}>
            Upload
          </Button>
        )}
      </Form>
    </Flex>
  );
};
