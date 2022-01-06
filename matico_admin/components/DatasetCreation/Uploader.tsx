import React, { useEffect, useState } from "react";
import { uploadFile } from "../../utils/api";
import { ProgressBar } from "@adobe/react-spectrum";

export interface UploaderProps {
  file: File;
  metadata: any;
  onDone?: () => void;
  onFail?: (error: any) => void;
}

export const Uploader: React.FC<UploaderProps> = ({
  file,
  metadata,
  onDone,
  onFail,
}) => {
  const [progress, setProgreess] = useState(0);
  useEffect(() => {
    uploadFile(file, "/datasets", metadata, setProgreess)
      .then(() => {
        if (onDone) {
          onDone();
        }
      })
      .error((error: any) => {
        if (onFail) {
          onFail(error);
        }
      });
  }, []);
  return <ProgressBar label="Uploading..." value={progress} />;
};
