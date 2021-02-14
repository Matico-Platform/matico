import axios, { AxiosResponse } from 'axios';

export interface Dataset {
    name: string;
    description: string;
    id: string;
    created_at: Date;
    updated_at: Date;
    geom_col: string;
    id_col: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export interface Page {
    limit: number;
    offset: number;
}

export enum BaseMap {
    CartoDBPositron = 'CartoDBPositron',
    CartoDBVoyager = 'CartoDBVoyager',
    CartoDBDarkMatter = 'CartoDBDarkMatter',
    Custom = 'Custom',
}

export const DefaultPolyonStyle: PolygonStyle = {
    Polygon: {
        fill: [140, 170, 180, 90],
        stroke: [200, 200, 200, 90],
        stroke_width: 3,
        opacity: 1,
    },
};

export const DefaultPointStyle: PointStyle = {
    Point: {
        fill: [140, 170, 180, 90],
        size: 20,
        stroke: [200, 200, 200, 90],
        stroke_width: 3,
        opacity: 1,
    },
};

export const DefaultLineStyle: LineStyle = {
    Line: {
        stroke: [200, 200, 200, 90],
        stroke_width: 3,
        opacity: 1,
    },
};

export interface PointStyle {
    Point: {
        fill: number[];
        size: number;
        stroke: number[];
        stroke_width: number;
        opacity: number;
    };
}

export interface PolygonStyle {
    Polygon: {
        fill: number[];
        stroke: number[];
        stroke_width: number;
        opacity: number;
    };
}

export interface LineStyle {
    Line: {
        stroke: number[];
        stroke_width: number;
        opacity: number;
    };
}

export interface QuerySource {
    Query: string;
}

export interface DatasetSource {
    Dataset: string;
}

export interface RawQuerySource {
    RawQuery: string;
}
export interface GeoJSONSource {
    url: string;
}

export type LayerSource =
    | QuerySource
    | DatasetSource
    | RawQuerySource
    | GeoJSONSource;

export type LayerStyle = PointStyle | PolygonStyle | LineStyle;

export interface Layer {
    source: LayerSource;
    style: LayerStyle;
    name: string;
    description: string;
}

export interface MapStyle {
    layers: Layer[];
    center: number[];
    zoom: number;
    base_map: BaseMap;
}

export const DefaultMapStyle: MapStyle = {
    center: [-74.006, 40.7128],
    zoom: 13,
    base_map: BaseMap.CartoDBVoyager,
    layers: [],
};

export interface Dashboard {
    name: string;
    id: string;
    description: string;
    owner_id: string;
    public: boolean;
    map_style: MapStyle;
    created_at: Date;
    updated_at: Date;
}

export interface CreateDashboardDTO {
    name: string;
    description: string;
    public: boolean;
    map_style: MapStyle;
}

export interface UpdateDashboardDTO {
    name?: string;
    description?: string;
    public?: boolean;
    map_style?: MapStyle;
}
// export interface Token {
//     iat: number;
//     exp: number;
//     username: string;
//     id: string;
// }

export interface LoginResponse {
    user: User;
    token: string;
}

export interface SignupResponse{
    user: User,
    token: string,
}

let a = axios.create({
    baseURL: 'http://localhost:8000/api',
    // !process.env.NODE_ENV ||
    // process.env.NODE_ENV === 'development'
    //     ? '/api'
    //     : `${window.location.origin}/api`,
    headers: { 'Content-Type': 'application/json' },
});

a.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export function uploadFile(
    file: File,
    url: string,
    metadata?: any,
    onProgress?: (progress: number) => void,
) {
    let formData = new FormData();

    console.log('metadata is ', metadata);

    formData.append('metadata', JSON.stringify(metadata));
    formData.append('file', file);

    const progress = (e: any) => {
        if (onProgress) {
            onProgress(Math.round((100 * e.loaded) / e.total));
        }
    };

    return a.post(url, formData, {
        headers: {
            Content_Type: 'multipart/form-data',
        },
        onUploadProgress: progress,
    });
}

type CreateSyncDataset = {
    name: string;
    url: string;
    description: string;
    refreshInterval: number;
};

export function createSyncDataset(syncDetails: CreateSyncDataset) {
    return a.post('/datasets', syncDetails);
}


export async function getProfile(): Promise<AxiosResponse<User>>{
    return a.get('/users/profile');
}

export async function login(
    email: String,
    password: String,
): Promise<AxiosResponse<LoginResponse>> {
    return a.post('/auth/login', { email, password });
}

export async function signup(
    username: String,
    password: String,
    email: String,
): Promise<AxiosResponse<SignupResponse>> {
    return a.post('/auth/signup', { email, password, username });
}

export async function getDatasets(): Promise<
    AxiosResponse<Dataset[]>
> {
    return a.get('/datasets');
}

export async function getDataset(
    id: string,
): Promise<AxiosResponse<Dataset>> {
    return a.get(`datasets/${id}`);
}

export async function getPagedDatasetData(
    id: string,
    page: Page,
): Promise<AxiosResponse<any>> {
    return a.get(`datasets/${id}/data`, { params: page });
}

export async function getDashboards(): Promise<
    AxiosResponse<Dashboard[]>
> {
    return a.get('dashboards');
}

export async function getDashboard(
    id: string,
): Promise<AxiosResponse<Dashboard>> {
    return a.get(`dashboards/${id}`);
}

export async function createDashboard(
    newDashboard: CreateDashboardDTO,
) {
    return a.post('/dashboards', newDashboard);
}

export async function updateDashboard(
    dataset_id: string,
    update: UpdateDashboardDTO,
): Promise<AxiosResponse<Dashboard>> {
    return a.put(`/dashboards/${dataset_id}`, update);
}

export async function updateFeature(
    dataset_id: string,
    feature_id: string,
    update: any,
) {
    return a.put(`dataset/${dataset_id}/data/${feature_id}`, update);
}
export default a;
