import React from 'react';
import { VerticalBarSeries, XYPlot, XAxis, YAxis } from 'react-vis';
import 'react-vis/dist/style.css';

interface HistogramDatum {
    id: string;
    x: number;
    y: number;
}

interface HistogramProps {
    data: HistogramDatum[];
}

export const Histogram: React.FC<HistogramProps> = ({ data }) => {
    return (
        <XYPlot height={150} width={250}>
            <VerticalBarSeries barWidth={2} data={data} />
            <XAxis />
            <YAxis />
        </XYPlot>
    );
};
