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
  StatusLight,
} from "@adobe/react-spectrum";
import React, { useCallback, useState } from "react";
import Upload from "@spectrum-icons/illustrations/Upload";
import { useDropzone } from "react-dropzone";
import { CSVFilePreviewer } from "./CSVFilePreviewer";
import { GeoJSONFilePreviewer } from "./GeoJSONFilePreviewer";
import { ShpFilePreviewer } from "./ShpFilePreviwer";

export interface NewUploadDatasetFormProps {}

const VALID_MIME_TYPES = [
  "application/vnd.ms-excel",
  "application/geo+json",
  "application/json",
  "application/csv",
  "text/csv",
  "text/plain",
];
const VALID_EXTENSIONS = ["csv", "geojson", "json", "zip"];

export const NewUploadDatasetForm: React.FC<NewUploadDatasetFormProps> = () => {
  const [acceptedFiles, setAcceptedFiles] = useState<Array<File> | null>(null);
  const [fileRejectionError, setFileRejectionError] = useState<string | null>(
    null
  );

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    acceptedFiles.length && setAcceptedFiles(acceptedFiles);
    acceptedFiles.length && setFileRejectionError(null);
  }, []);

  const validator = (file: any) => {
    const fileType = file.type;
    const extension = file.name.split(".").slice(-1)[0].toLowerCase();

    if (
      VALID_MIME_TYPES.includes(fileType) ||
      VALID_EXTENSIONS.includes(extension)
    ) {
      return;
    }
    setFileRejectionError(
      "CSV, GeoJson, Json and zipped shapefiles are supported at this time."
    );
    return {
      code: "File type error",
      message: "Use a csv, geojson, json or zipped shapefile.",
    };
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      //@ts-ignore
      validator,
    });

  // todo: refactor this to enumerations of file types and map MIME types to file types
  const previewerForFile = (file: File) => {
    if (file.type.length) {
      switch (file.type) {
        case "application/csv":
        case "text/csv":
          return <CSVFilePreviewer file={file} />;
        case "application/geo+json":
          return <GeoJSONFilePreviewer file={file} />;
        case "application/zip":
          return <ShpFilePreviewer file={file} />;
      }
    } else if (file.name.length) {
      const fileType = file.name.split(".").slice(-1)[0].toLowerCase();
      switch (fileType) {
        case "csv":
          return <CSVFilePreviewer file={file} />;
        case "geojson":
          return <GeoJSONFilePreviewer file={file} />;
        case "zip":
          return <ShpFilePreviewer file={file} />;
      }
    } else {
      return null;
    }
  };

  const dropMessage = isDragActive ? "Drop it here!" : "Drag and drop a file";
  const message = isDragReject
    ? "Only csv, json and geojson files are currently supported"
    : dropMessage;

  return (
    <Flex direction="column" marginTop="size-400" height="100%">
      {!acceptedFiles && (
        <div {...getRootProps()} style={{ width: "100%", height: "100%" }}>
          <input {...getInputProps()} />
          <Flex alignItems="center" justifyContent="center" height="100%">
            <View>
              <IllustratedMessage>
                <Upload />
                <Heading>{message}</Heading>
                <Content>
                  Select a File from your computer
                  {!!fileRejectionError && (
                    <StatusLight variant="negative">
                      {fileRejectionError}
                      <br />
                      Please upload a different file.
                    </StatusLight>
                  )}
                </Content>
              </IllustratedMessage>
            </View>
          </Flex>
        </div>
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
              <Item key={file.name}>{previewerForFile(file)}</Item>
            ))}
          </TabPanels>
        </Tabs>
      )}
    </Flex>
  );
};
