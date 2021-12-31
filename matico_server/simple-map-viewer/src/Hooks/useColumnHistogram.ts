import { useState, useEffect } from 'react';
import {getColumnHistogram } from 'api';
import { Column, LayerSource, } from 'types'

export const useColumnHistogram = (
    column: Column,
    source: LayerSource,
    bins: number,
) => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (column && source && bins) {
            getColumnHistogram(column, source, bins)
                .then((result) => {
                    setData(result.data.Histogram);
                })
                .catch((e) => {
                    console.log(
                        'Something went wrong getting histogram ',
                        e,
                    );
                    setData(undefined);
                });
        }
    }, [column, source, bins]);
    return data;
};
