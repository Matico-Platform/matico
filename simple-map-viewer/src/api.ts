import axios, { AxiosResponse } from 'axios';

export interface Dataset {
    name: string;
    description: string;
    id: string;
    create_at: Date;
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

let a = axios.create({
    baseURL:  (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? '/api' :`${window.location.origin}/api`,
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
): Promise<AxiosResponse<User>> {
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
    return a.get(`datasets/${id}/query`, { params: page });
}
export default a;
