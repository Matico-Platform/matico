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

export interface NewUploadDatasetFormProps {}

const VALID_MIME_TYPES = ["application/vnd.ms-excel","application/geo+json","application/json","application/csv","text/csv","text/plain"]
const VALID_EXTENSIONS = ["csv","geojson","json"]

export const NewUploadDatasetForm: React.FC<NewUploadDatasetFormProps> = () => {
  const [acceptedFiles, setAcceptedFiles] = useState<Array<File> | null>(null);
  const [fileRejectionError, setFileRejectionError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    acceptedFiles.length && setAcceptedFiles(acceptedFiles);
    acceptedFiles.length && setFileRejectionError(null)
  }, []);

  const validator = (file: any) => {
    const fileType = file.type;
    const extension = file.name.split('.').slice(-1)[0].toLowerCase()
    
    if (VALID_MIME_TYPES.includes(fileType) || VALID_EXTENSIONS.includes(extension)) {
      return;
    }
    setFileRejectionError("CSV, GeoJson, and Json files are supported at this time.")
    return  {
      code: "File type error",
      message: "Use a csv, geojson, or json file."
    }
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      //@ts-ignore
      validator
      // accept:
      //   ".csv,.geojson,.json,application/vnd.ms-excel,application/geo+json,application/json,application/csv,text/csv,text/plain",
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
        <div {...getRootProps()} style={{width:"100%", height:"100%"}}>
          <input {...getInputProps()} />
            <Flex alignItems="center" justifyContent="center" height="100%">
              <View>
                  <IllustratedMessage>
                    <Upload />
                    <Heading>{message}</Heading>
                    <Content>
                      Select a File from your computer
                      {!!fileRejectionError && 
                        <StatusLight variant="negative">
                          {fileRejectionError} 
                          <br/>
                          Please upload a different file.
                        </StatusLight>}
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
