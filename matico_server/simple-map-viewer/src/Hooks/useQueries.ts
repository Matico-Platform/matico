import { useState, useEffect } from 'react';
import { getQueries } from 'api';

export const useQueries = () => {
    const [queries, setQueries] = useState<any[]>();
    const [error, setError] =
        useState<string | null | undefined>(null);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        getQueries()
            .then((result) => {
                setLoading(true);
                setQueries(result.data);
            })
            .catch((e) => {
                setError(e.toString());
            })
            .finally(() => setLoading(false));
    }, []);
    return { queries, error, loading };
};
