import {
  View,
  IllustratedMessage,
  Heading,
  Content,
  Tabs,
  TabList,
  TabPanels,
  Item,
} from "@adobe/react-spectrum";
import React, { useCallback, useState } from "react";
import Upload from "@spectrum-icons/illustrations/Upload";
import { useDropzone } from "react-dropzone";
import { FilePreviewer } from "./FilePreviewer";

export interface NewUploadDatasetFormProps {}

export const NewUploadDatasetForm: React.FC<NewUploadDatasetFormProps> = () => {
  const [acceptedFiles, setAcceptedFiles] = useState<Array<File> | null>(null);

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    setAcceptedFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: "application/geo+json,application/json,application/csv,text/csv",
    });

  const dropMessage = isDragActive ? "Drop it here!" : "Drag and drop a file";
  const message = isDragReject
    ? "Only csv, json and geojson files are currently supported"
    : dropMessage;

  return (
    <View paddingTop="size-400">
      {!acceptedFiles && (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <IllustratedMessage>
            <Upload />
            <Heading>{message}</Heading>
            <Content>Select a File from your computer</Content>
          </IllustratedMessage>
        </div>
      )}
      {acceptedFiles && (
        <Tabs orientation="vertical">
          <TabList>
            {acceptedFiles.map((file: File) => (
              <Item key={file.name}>{file.name}</Item>
            ))}
          </TabList>
          <TabPanels>
            {acceptedFiles.map((file: File) => (
              <Item key={file.name}>
                <FilePreviewer file={file} />
              </Item>
            ))}
          </TabPanels>
        </Tabs>
      )}
    </View>
  );
};
