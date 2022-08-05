import * as React from 'react';
import { Group } from '@visx/group';
import { ViolinPlot, BoxPlot } from '@visx/stats';
import { LinearGradient } from '@visx/gradient';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Stats } from '@visx/mock-data/lib/generators/genStats';
import { withTooltip, Tooltip, defaultStyles as defaultTooltipStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { PatternLines } from '@visx/pattern';
import { DistributionSpec, ColorOutput, DataRow, PlotLayersProperties, BoxPlotStats } from "../../types";


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
    const values = data.reduce((allValues, { boxPlot }) => {
      allValues.push(boxPlot.min, boxPlot.max, Math.min(...boxPlot.outliers), Math.max(...boxPlot.outliers));
      return allValues;
    }, [] as number[]);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // Determines the boxplot's "top" and "bottom" depending on orientation
    const boxExtentScale = scaleBand<number>({
      range: horizontal ? [0.05 * xMax, 0.95 * xMax] : [0.05 * yMax, 0.95 * yMax],
      round: true,
      domain: [minValue, maxValue]
    });

    // Scale for spacing out multiple boxplots
    const spacingScale = scaleBand<string>({
      range: [0, (horizontal ? yMax : xMax)],
      round: true,
      domain: data.map(x),
      padding: 0.25
    });

    const xScale = scaleBand<string>({
      range: [0, (horizontal ? yMax : xMax)],
      round: true,
      domain: data.map(x),
      padding: 0.25,
    });

    const yScale = scaleLinear<number>({
      range: (horizontal? [xMax * 0.05, xMax * 0.95] : [yMax * 0.95 , yMax * 0.05]),
      round: true,
      domain: [minValue, maxValue],
    });

    
    const boxWidth = xScale.bandwidth();

    return xMax < 10 ? null : (
      <div style={{ position: 'relative' }}>
        <svg width={xMax} height={yMax}>
          {/* <LinearGradient id="statsplot" to="#8b6ce7" from="#87f2d4" />
          <rect x={0} y={0} width={xMax} height={yMax} fill={background} rx={0} />*/}
          <Group top={0}>
            {data.map((d: BoxPlotStats, i) => (
              <g key={i}>
                {showViolinPlot ? <ViolinPlot
                  data={d.binData}
                  stroke={formatColor(violinPlotStroke)}
                  left={(horizontal ? 0 : xScale(x(d))!)}
                  top={(horizontal ? xScale(x(d))! : 0)}
                  width={boxWidth}
                  valueScale={yScale}
                  fill={formatColor(violinPlotFill)}
                  horizontal={horizontal}
                /> : null}
                {showBoxPlot ? <BoxPlot
                  min={min(d)}
                  max={max(d)}
                  left={xScale(x(d))! + 0.3 * boxWidth}
                  firstQuartile={firstQuartile(d)}
                  thirdQuartile={thirdQuartile(d)}
                  median={median(d)}
                  boxWidth={boxWidth * 0.4}
                  fill={formatColor(boxPlotFill)}
                  fillOpacity={0.3}
                  stroke={formatColor(boxPlotStroke)}
                  strokeWidth={2}
                  valueScale={yScale}
                  outliers={outliers(d)}
                  horizontal={horizontal}
                  minProps={{
                    onMouseOver: () => {
                      showTooltip({
                        tooltipTop: yScale(min(d)) ?? 0 + 40,
                        tooltipLeft: xScale(x(d))! + boxWidth + 5,
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
                        tooltipLeft: xScale(x(d))! + boxWidth + 5,
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
                        tooltipLeft: xScale(x(d))! + boxWidth + 5,
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
                        tooltipLeft: xScale(x(d))! + boxWidth + 5,
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