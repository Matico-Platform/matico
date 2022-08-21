import React, { useEffect, useState } from "react";
import { ProgressBar } from "@adobe/react-spectrum";
import axios from 'axios' 
import ColumnTable from "arquero/dist/types/table/column-table";
import {Dataset} from "@prisma/client";

export interface UploaderProps {
  table: ColumnTable;
  metadata: {
    name:string,
    description:string,
    public:boolean 
  };
  onDone?: (dataset: Dataset & {dataUrl:string}) => void;
  onFail?: (error: any) => void;
}

function uploadFile(
  table: ColumnTable,
  url: string,
  metadata?: any,
  onProgress?: (progress: number) => void
) {

  const progress = (e: any) => {
    if (onProgress) {
      onProgress(Math.round((100 * e.loaded) / e.total));
    }
  };
  return axios.put(url, table.toArrowBuffer(),{
    headers:{
      "Access-Control-Allow-Origin":"*",
      "Content-type": "application/vnd.apache.arrow.file"
    },
    onUploadProgress: progress,
  });
}

export const Uploader: React.FC<UploaderProps> = ({
  table,
  metadata,
  onDone,
  onFail,
}) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<any | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);
  useEffect(() => {

    fetch("/api/datasets/upload", {method: "POST",  body:JSON.stringify(metadata), headers:{ContentType:"application/json"} }).then(r=>r.json()).then(
      (dataset)=>{
        uploadFile(
          table,
          dataset.dataUrl,
          {...metadata},
          setProgress
        )
          .then((response  :any) => {
            setIsDone(true)
            if (onDone) {
              onDone(dataset);
            }
          })
          .catch((error: any) => {
            setError(error);
            if (onFail) {
              onFail(error);
            }
          });
    })

  }, []);

  return <ProgressBar label="Uploading..." value={progress} />;
};
