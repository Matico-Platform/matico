import pappa from "papaparse";

export const getCSVPreview = (file: File) => {
  return new Promise((resolve, reject) => {
    pappa.parse(file, {
      worker: true,
      header: true,
      dynamicTyping: true,
      preview: 10,
      skipEmptyLines: true,
      complete: (data) => {
        resolve(data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
