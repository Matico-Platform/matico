import { useState, useEffect } from 'react';
import {
    getColumnStats,
} from 'api';

import{
    Column,
    LayerSource,
    DatasetSource,
} from 'types'

export function useBasicColumnStats(
    column?: Column,
    source?: LayerSource,
) {
    const [stats, setStats] = useState<undefined | null | any>(
        undefined,
    );

    useEffect(() => {
        if (source && column) {
            getColumnStats(source, column)
                .then((result) => {
                    console.log('result from querry ', result);
                    setStats(result.data.BasicStats);
                })
                .catch((e) => {
                    console.log('failed to get basic stats', e);
                    setStats(undefined);
                });
        } else {
            setStats(undefined);
        }
    }, [source, column]);

    return stats;
}
