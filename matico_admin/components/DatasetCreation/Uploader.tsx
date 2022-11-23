import React, { useEffect, useState } from "react";
import { ProgressBar } from "@adobe/react-spectrum";

export interface UploaderProps {
  file: File;
  metadata: any;
  onDone?: () => void;
  onFail?: (error: any) => void;
}

function uploadFile(
  file: File,
  url: string,
  metadata?: any,
  onProgress?: (progress: number) => void
) {
  const formData = new FormData();

  formData.append("file", file);

  const progress = (e: any) => {
    if (onProgress) {
      onProgress(Math.round((100 * e.loaded) / e.total));
    }
  };

  return a.post(url, formData, {
    headers: {
      Content_Type: "multipart/form-data",
    },
    onUploadProgress: progress,
  });
}

export const Uploader: React.FC<UploaderProps> = ({
  file,
  metadata,
  onDone,
  onFail,
}) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<any | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);
  useEffect(() => {
    uploadFile(
      file,
      "/datasets",
      { ...metadata, geom_col: "wkb_geometry", id_col: "ogc_fid" },
      setProgress
    )
      .then((response: any) => {
        setIsDone(true);
        if (onDone) {
          onDone();
        }
      })
      .catch((error: any) => {
        setError(error);
        if (onFail) {
          onFail(error);
        }
      });
  }, []);

  return <ProgressBar label="Uploading..." value={progress} />;
};
