import {
  View,
  IllustratedMessage,
  Heading,
  Content,
  Tabs,
  TabList,
  TabPanels,
  Item,
  Flex,
} from "@adobe/react-spectrum";
import React, { useCallback, useState } from "react";
import Upload from "@spectrum-icons/illustrations/Upload";
import { useDropzone } from "react-dropzone";
import { CSVFilePreviewer } from "./CSVFilePreviewer";
import { faAlignJustify } from "@fortawesome/free-solid-svg-icons";
import { GeoJSONFilePreviewer } from "./GeoJSONFilePreviewer";

export interface NewUploadDatasetFormProps {}

export const NewUploadDatasetForm: React.FC<NewUploadDatasetFormProps> = () => {
  const [acceptedFiles, setAcceptedFiles] = useState<Array<File> | null>(null);

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    setAcceptedFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept:
        "application/geo+json,application/json,application/csv,text/csv,text/plain,*.csv,*.geojson",
    });

  const previewerForFile = (file: File) => {
    if (file.type.includes("csv")) {
      return <CSVFilePreviewer file={file} />;
    } else {
      return <GeoJSONFilePreviewer file={file} />;
    }
  };
  const dropMessage = isDragActive ? "Drop it here!" : "Drag and drop a file";
  const message = isDragReject
    ? "Only csv, json and geojson files are currently supported"
    : dropMessage;

  return (
    <Flex direction='column' paddingTop="size-400" height="100%">
      {!acceptedFiles && (
        <Flex alignItems="center" justifyContent="center" height="100%">
          <View>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <IllustratedMessage>
                <Upload />
                <Heading>{message}</Heading>
                <Content>Select a File from your computer</Content>
              </IllustratedMessage>
            </div>
          </View>
        </Flex>
      )}
      {acceptedFiles && (
        <Tabs orientation="horizontal" width="100%" height="100%">
          <TabList>
            {acceptedFiles.map((file: File) => (
              <Item key={file.name}>{file.name}</Item>
            ))}
          </TabList>
            <TabPanels>
              {acceptedFiles.map((file: File) => (
                <Item key={file.name}>
                  {previewerForFile(file)}
                </Item>
              ))}
            </TabPanels>
        </Tabs>
      )}
    </Flex>
  );
};
