import * as React from 'react';
import { Group } from '@visx/group';
import { ViolinPlot, BoxPlot } from '@visx/stats';
import { LinearGradient } from '@visx/gradient';
import { scaleBand, scaleLinear } from '@visx/scale';
import genStats, { Stats } from '@visx/mock-data/lib/generators/genStats';
import { getSeededRandom, getRandomNormal } from '@visx/mock-data';
import { withTooltip, Tooltip, defaultStyles as defaultTooltipStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { PatternLines } from '@visx/pattern';

// accessors
const x = (d: Stats) => d.boxPlot.x;
const min = (d: Stats) => d.boxPlot.min;
const max = (d: Stats) => d.boxPlot.max;
const median = (d: Stats) => d.boxPlot.median;
const firstQuartile = (d: Stats) => d.boxPlot.firstQuartile;
const thirdQuartile = (d: Stats) => d.boxPlot.thirdQuartile;

interface TooltipData {
    name?: string;
    min?: number;
    median?: number;
    max?: number;
    firstQuartile?: number;
    thirdQuartile?: number;
}

export type StatsPlotProps = {
    width: number;
    height: number;
}

export default withTooltip<StatsPlotProps, TooltipData>(
    ({
        width,
        height,
        tooltipOpen,
        tooltipLeft,
        tooltipTop,
        tooltipData,
        showTooltip,
        hideTooltip
    }: StatsPlotProps & WithTooltipProvidedProps<TooltipData>) => {

    }
)
