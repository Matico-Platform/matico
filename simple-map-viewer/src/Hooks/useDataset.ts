import { useState, useEffect } from 'react';
import {
    Dataset,
    getDataset,
    Page,
    getPagedDatasetData,
} from '../api';

export const useDataset = (id: string) => {
    const [dataset, setDataset] = useState<Dataset | null>(null);
    const [error, setError] = useState<String | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        getDataset(id)
            .then((result) => setDataset(result.data))
            .catch((e) => setError(e.toString()))
            .finally(() => setLoading(false));
    }, [id]);

    return { dataset, error, loading };
};

export const useDatasetPagedResults = (
    id: string | null | undefined,
    page: Page,
) => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (id) {
            getPagedDatasetData(id, page)
                .then((result) => setData(result.data))
                .catch((e) => setError(e.toString()))
                .finally(() => setLoading(false));
        } else {
            setData([]);
            setLoading(false);
            setError(null);
        }
    }, [id, page.limit, page.offset]);

    return { data, error, loading };
};
