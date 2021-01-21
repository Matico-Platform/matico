import axios from 'axios';

let a = axios.create({
    baseURL: 'http://localhost:8080',
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
    onProgress: (progress: number) => void,
) {
    let formData = new FormData();
    formData.append('file', file);

    const progress = (e: any) => {
        onProgress(Math.round((100 * e.loaded) / e.total));
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

export default a;
