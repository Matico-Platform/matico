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
      .then((response  :any) => {
        setIsDone(true)
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
