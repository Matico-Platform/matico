import React, { useEffect, useState } from 'react';
import { Histogram } from 'Components/Charts/Histogram/Histogram';

import {
    Column,
    NumericalCategorizationMethod,
    LayerSource,
    Color,
} from 'api';

import { useBasicColumnStats } from 'Hooks/useBasicColumnStats';
import { useColumnHistogram } from 'Hooks/useColumnHistogram';

interface CategorizerProps {
    column: Column;
    source: LayerSource;
    method: NumericalCategorizationMethod;
    onUpdate: (method: NumericalCategorizationMethod) => void;
}

export const Categorizer: React.FC<CategorizerProps> = ({
    column,
    source,
}) => {
    const [
        method,
        setMethod,
    ] = useState<NumericalCategorizationMethod>(
        NumericalCategorizationMethod.EqualInterval,
    );

    const histogramValues = useColumnHistogram(column, source, 10);
    const basicStats = useBasicColumnStats(column, source);

    // useEffect(() => {}, [basicStats]);

    return (
        <div>
            <ul>
                {Object.values(NumericalCategorizationMethod).map(
                    (method: string) => (
                        <button>{method}</button>
                    ),
                )}
            </ul>
            {histogramValues && (
                <Histogram
                    data={histogramValues.map(
                        (hv: any, index: number) => ({
                            id: index,
                            x: hv.bin_mid,
                            y: hv.freq,
                        }),
                    )}
                />
            )}
            {basicStats && (
                <p>
                    {basicStats.min}- {basicStats.max}
                </p>
            )}
        </div>
    );
};
