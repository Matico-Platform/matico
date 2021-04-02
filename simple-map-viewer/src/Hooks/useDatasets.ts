import { useState, useEffect } from 'react';
import { getDatasets, Dataset } from 'api';

export const useDatasets = () => {
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const refreshDatasets = ()=>{
        setLoading(true);
        console.log('refreshing in hook ')
        getDatasets()
            .then((result) => {
                setDatasets(result.data);
            })
            .catch((e) => {
                setError(e.toString());
            })
            .finally(() => {
                setLoading(false);
            });
    } ;
    useEffect(()=> refreshDatasets(), [])
    return { datasets, error, loading, refreshDatasets };
};
