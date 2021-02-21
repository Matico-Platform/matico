import { useState, useEffect } from 'react';
import {
  Page,
  runQuery,
  getPagedDatasetData
} from '../api';

interface DatasetStrategy {
  datasetId?: string,
  sql?: string,
}

export const useData = (strategy: DatasetStrategy, pagination: Page) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (strategy.sql) {
      runQuery(strategy.sql, pagination)
        .then((result) => setData(result.data))
        .catch((e) => setError(e.toString()))
        .finally(() => setLoading(false));
    } else if (strategy.datasetId) {
      getPagedDatasetData(strategy.datasetId, pagination)
        .then((result) => setData(result.data))
        .catch((e) => setError(e.toString()))
        .finally(() => setLoading(false));
    } else {
      setData([]);
      setLoading(false);
      setError(null);
    }
  }, [strategy.datasetId, strategy.sql, JSON.stringify(pagination)]);

  return { data, error, loading };
};
