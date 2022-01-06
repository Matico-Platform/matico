import {
  View,
  IllustratedMessage,
  Heading,
  Content,
} from "@adobe/react-spectrum";
import React, { useCallback, useState } from "react";
import Upload from "@spectrum-icons/illustrations/Upload";
import { useDropzone } from "react-dropzone";

export interface NewUploadDatasetFormProps {}

export const NewUploadDatasetForm: React.FC<NewUploadDatasetFormProps> = () => {
  const onDrop = useCallback((accptedFiles: any) => {
    
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
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <IllustratedMessage>
          <Upload />
          <Heading>{message}</Heading>
          <Content>Select a File from your computer</Content>
        </IllustratedMessage>
      </div>
    </View>
  );
};
