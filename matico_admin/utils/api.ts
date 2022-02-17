import axios, { AxiosResponse } from "axios";
import { User, LoginResponse, SignupResponse } from "../types/Users";
import { Dataset, Column } from "../types/Dataset";
import {
  Dashboard,
  CreateDashboardDTO,
  UpdateDashboardDTO,
} from "../types/DashboardSpecification";
import { Query, QueryParameter, ValueCount } from "../types/Query";
import { Page } from "../types/Pagination";
import useSWR from "swr";

// export interface Token {
//     iat: number;
//     exp: number;
//     username: string;
//     id: string;
// }
//

export enum SourceType {
  API = "api",
  Dataset = "dataset",
  Query = "query",
}
export type Source = {
  id: string;
  type: SourceType;
  parameters?: { [param: string]: any };
  query?: string;
};

export const tileUrlForSource = (source: Source | undefined) => {
  if (!source) {
    return null;
  }
  switch (source.type) {
    case SourceType.Dataset:
      return `http://localhost:8000/api/tiler/dataset/${source.id}/{z}/{x}/{y}`;
    case SourceType.API:
      return `http://localhost:8000/api/tiler/api/${
        source.id
      }/{z}/{x}/{y}?${Object.keys(source.parameters!)
        .map((key: string) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(source.parameters![key])}`
        )
        .join("&")}`;
    case SourceType.Query:
      return `http://localhost:8000/api/tiler/{z}/{x}/{y}?q=${encodeURIComponent(
        source.query!
      )}`;
  }
};

export const urlForSource = (source: Source) => {
  switch (source?.type) {
    case SourceType.Dataset:
      return `/datasets/${source?.id}`;
    case SourceType.API:
      return `/apis/${source?.id}`;
    default:
      return null;
  }
};

const a = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

a.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function uploadFile(
  file: File,
  url: string,
  metadata?: any,
  onProgress?: (progress: number) => void
) {
  const formData = new FormData();

  formData.append("metadata", JSON.stringify(metadata));
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

type CreateSyncDataset = {
  name: string;
  sync_url: string;
  description: string;
  sync_frequency_seconds: number;
  public: boolean;
};

export function createSyncDataset(syncDetails: CreateSyncDataset) {
  return a.post("/datasets", syncDetails);
}

export function deleteDashboard(dashboard_id: string) {
  return a.delete(`/dashboards/${dashboard_id}`);
}

export function deleteDataset(dataset_id: string) {
  return a.delete(`/datasets/${dataset_id}`);
}

export async function getProfile(): Promise<AxiosResponse<User>> {
  return a.get("/users/profile");
}

export async function login(
  email: string,
  password: string
): Promise<AxiosResponse<LoginResponse>> {
  return a.post("/auth/login", { email, password });
}

export async function signup(
  username: string,
  password: string,
  email: string
): Promise<AxiosResponse<SignupResponse>> {
  return a.post("/auth/signup", { email, password, username });
}

export async function getDatasets(): Promise<AxiosResponse<Dataset[]>> {
  return a.get("/datasets");
}

export async function getDataset(id: string): Promise<AxiosResponse<Dataset>> {
  return a.get(`datasets/${id}`);
}

export async function getPagedDatasetData(
  id: string,
  page: Page
): Promise<AxiosResponse<any>> {
  return a.get(`datasets/${id}/data`, { params: page });
}

export async function getApps(): Promise<AxiosResponse<Dashboard[]>> {
  return a.get("apps");
}

export async function getDatasetColumns(
  id: string
): Promise<AxiosResponse<Column[]>> {
  return a.get(`datasets/${id}/columns`);
}

export async function getApp(id: string): Promise<AxiosResponse<Dashboard>> {
  return a.get(`apps/${id}`);
}

export async function createApp(newDashboard: CreateDashboardDTO) {
  return a.post("/apps", newDashboard);
}

export async function updateApp(
  appID: string,
  update: UpdateDashboardDTO
): Promise<AxiosResponse<Dashboard>> {
  return a.put(`/apps/${appID}`, update);
}

export async function updateFeature(
  dataset_id: string,
  feature_id: string | number,
  update: any
) {

  return a.put(`datasets/${dataset_id}/data/${feature_id}`, update);
}

// export async function getColumnStats(
//     source: LayerSource,
//     column: Column,
// ) {
//     if (Object.keys(source)[0] === 'Dataset') {
//         const datasetSource = source as DatasetSource;
//         return a.get(
//             `datasets/${datasetSource.Dataset}/columns/${
//                 column.name
//             }/stats?stat=${JSON.stringify({
//                 BasicStats: {
//                     no_bins: 20,
//                 },
//             })}`,
//         );
//     } else {
//         throw Error(
//             'Layer source does not implement this functionality yet',
//         );
//     }
// }
export async function getUniqueColumnValues(
  dataset_id: string,
  column_name: string
) {
  return a.get(
    `datasets/${dataset_id}/columns/${column_name}/stats?stat=${JSON.stringify({
      ValueCounts: {},
    })}`
  );
}

export async function createApi(newAPI: any) {
  return a.post("/apis", newAPI);
}

export async function updateApi(id: string, newAPI: any) {
  return a.put(`/apis/${id}`, newAPI);
}

export async function updateDataset(id: string, newDataset: any) {
  return a.put(`/datasets/${id}`, newDataset);
}
export async function getApis() {
  return a.get("/apis");
}

// export async function getColumnHistogram(
//     column: Column,
//     source: LayerSource,
//     bins: number,
// ) {
//     if (Object.keys(source)[0] === 'Dataset') {
//         const datasetSource = source as DatasetSource;
//         return a.get(
//             `datasets/${datasetSource.Dataset}/columns/${
//                 column.name
//             }/stats?stat=${JSON.stringify({
//                 Histogram: {
//                     no_bins: 20,
//                 },
//             })}`,
//         );
//     } else {
//         throw Error(
//             'Layer source does not implement this functionality yet',
//         );
//     }
// }

// not sure if run is the right verb here, but
// this endpoint isn't restful anyway
export async function runQuery(
  sql: string,
  page: Page
): Promise<AxiosResponse<Dataset>> {
  return a.get(`queries/run?q=${sql}`, { params: page });
}

export const useSWRAPI = (endpoint: string | null, opts?: any) => {
  const { params, ...swrOpts } = opts;
  return useSWR(
    endpoint ? [endpoint, params] : null,
    (url: string) => a.get(url, { params }).then((res) => res.data),
    swrOpts
  );
};

export default a;
