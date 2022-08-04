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
import { DistributionSpec, ColorOutput, DataRow, PlotLayersProperties, BoxPlotStats } from "../../types";

// seeded randomness - we won't need this when we supply our own data
const seededRandom = getSeededRandom(0.1);
const randomNormal = getRandomNormal.source(getSeededRandom(0.789))(4, 3);
const data: Stats[] = genStats(5, randomNormal, () => 10 * seededRandom());

function formatColor (color:ColorOutput) {
  if (typeof color == "string") {
    return color;
  } else if (Array.isArray(color)) {
    let prefix = color.length === 3 ? "rgb" : "rgba"
    return `${prefix}(${color.join(",")})`;
  }
}

// accessors
const x = (d: BoxPlotStats) => d.boxPlot.x;
const min = (d: BoxPlotStats) => d.boxPlot.min;
const max = (d: BoxPlotStats) => d.boxPlot.max;
const median = (d: BoxPlotStats) => d.boxPlot.median;
const firstQuartile = (d: BoxPlotStats) => d.boxPlot.firstQuartile;
const thirdQuartile = (d: BoxPlotStats) => d.boxPlot.thirdQuartile;
const outliers = (d: BoxPlotStats) => d.boxPlot.outliers;

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
};

export const DistributionPlotComponent = (props: DistributionSpec & PlotLayersProperties) => {
  const {
    data,
    showBoxPlot = true,
    boxPlotStroke = 'black',
    boxPlotFill = 'white',
    showViolinPlot = true,
    violinPlotStroke = 'black',
    violinPlotFill = 'white',
    horizontal = false,
    tooltip = true,
    xMax,
    yMax
  } = {
    ...props,
    ...props.layer,
  }
  withTooltip<TooltipData>(
  ({
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    showTooltip,
    hideTooltip,
  }: WithTooltipProvidedProps<TooltipData>) => {

    // scales
    const xScale = scaleBand<string>({
      range: [0, xMax],
      round: true,
      domain: data.map(x),
      padding: 0.4,
    });

    const values = data.reduce((allValues, { boxPlot }) => {
      allValues.push(boxPlot.min, boxPlot.max);
      return allValues;
    }, [] as number[]);
    const minYValue = Math.min(...values);
    const maxYValue = Math.max(...values);

    const yScale = scaleLinear<number>({
      range: [yMax - 120, 0],
      round: true,
      domain: [minYValue, maxYValue],
    });

    const boxWidth = xScale.bandwidth();
    const constrainedWidth = Math.min(40, boxWidth);

    return xMax < 10 ? null : (
      <div style={{ position: 'relative' }}>
        <svg width={xMax} height={yMax}>
          {/* <LinearGradient id="statsplot" to="#8b6ce7" from="#87f2d4" />
          <rect x={0} y={0} width={xMax} height={yMax} fill="url(#statsplot)" rx={14} />
          <PatternLines
            id="hViolinLines"
            height={3}
            width={3}
            stroke="#ced4da"
            strokeWidth={1}
            // fill="rgba(0,0,0,0.3)"
            orientation={['horizontal']}
          /> */}
          <Group top={40}>
            {data.map((d: BoxPlotStats, i) => (
              <g key={i}>
                {showViolinPlot ? <ViolinPlot
                  data={d.binData}
                  stroke={formatColor(violinPlotStroke)}
                  left={xScale(x(d))!}
                  width={constrainedWidth}
                  valueScale={yScale}
                  fill={formatColor(violinPlotFill)}
                /> : null}
                {showBoxPlot ? <BoxPlot
                  min={min(d)}
                  max={max(d)}
                  left={xScale(x(d))! + 0.3 * constrainedWidth}
                  firstQuartile={firstQuartile(d)}
                  thirdQuartile={thirdQuartile(d)}
                  median={median(d)}
                  boxWidth={constrainedWidth * 0.4}
                  fill={formatColor(boxPlotFill)}
                  fillOpacity={0.3}
                  stroke={formatColor(boxPlotStroke)}
                  strokeWidth={2}
                  valueScale={yScale}
                  outliers={outliers(d)}
                  minProps={{
                    onMouseOver: () => {
                      showTooltip({
                        tooltipTop: yScale(min(d)) ?? 0 + 40,
                        tooltipLeft: xScale(x(d))! + constrainedWidth + 5,
                        tooltipData: {
                          min: min(d),
                          name: x(d),
                        },
                      });
                    },
                    onMouseLeave: () => {
                      hideTooltip();
                    },
                  }}
                  maxProps={{
                    onMouseOver: () => {
                      showTooltip({
                        tooltipTop: yScale(max(d)) ?? 0 + 40,
                        tooltipLeft: xScale(x(d))! + constrainedWidth + 5,
                        tooltipData: {
                          max: max(d),
                          name: x(d),
                        },
                      });
                    },
                    onMouseLeave: () => {
                      hideTooltip();
                    },
                  }}
                  boxProps={{
                    onMouseOver: () => {
                      showTooltip({
                        tooltipTop: yScale(median(d)) ?? 0 + 40,
                        tooltipLeft: xScale(x(d))! + constrainedWidth + 5,
                        tooltipData: {
                          ...d.boxPlot,
                          name: x(d),
                        },
                      });
                    },
                    onMouseLeave: () => {
                      hideTooltip();
                    },
                  }}
                  medianProps={{
                    style: {
                      stroke: formatColor(boxPlotStroke),
                    },
                    onMouseOver: () => {
                      showTooltip({
                        tooltipTop: yScale(median(d)) ?? 0 + 40,
                        tooltipLeft: xScale(x(d))! + constrainedWidth + 5,
                        tooltipData: {
                          median: median(d),
                          name: x(d),
                        },
                      });
                    },
                    onMouseLeave: () => {
                      hideTooltip();
                    },
                  }}
                /> : null }
              </g>
            ))}
          </Group>
        </svg>

        {tooltipOpen && tooltipData && (
          <Tooltip
            top={tooltipTop}
            left={tooltipLeft}
            style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white' }}
          >
            <div>
              <strong>{tooltipData.name}</strong>
            </div>
            <div style={{ marginTop: '5px', fontSize: '12px' }}>
              {tooltipData.max && <div>max: {tooltipData.max}</div>}
              {tooltipData.thirdQuartile && <div>third quartile: {tooltipData.thirdQuartile}</div>}
              {tooltipData.median && <div>median: {tooltipData.median}</div>}
              {tooltipData.firstQuartile && <div>first quartile: {tooltipData.firstQuartile}</div>}
              {tooltipData.min && <div>min: {tooltipData.min}</div>}
            </div>
          </Tooltip>
        )}
      </div>
    );
  },
);
}