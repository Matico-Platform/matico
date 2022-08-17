import * as React from 'react';
import { useState } from 'react';
import { Group } from '@visx/group';
import { ViolinPlot, BoxPlot } from '@visx/stats';
import { useTooltip, useTooltipInPortal, defaultStyles as defaultTooltipStyles, Tooltip, TooltipWithBounds } from '@visx/tooltip';
import { DistributionSpec, PlotLayersProperties, BoxPlotStats } from "../../types";
import { sanitizeColor } from '../../../Utils';
import { localPoint } from '@visx/event'
//import { Stats } from '@visx/mock-data/lib/generators/genStats';

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
      tooltipOn = true,
      xScale,
      yScale,
      xExtent,
      yExtent,
      xMax,
      yMax
    } = {
      ...props,
      ...props.layer,
    };

    // Setup for tooltip is taken from the visx pointer tooltip example
    // Set both boundary detection and in portal to be true
    const [tooltipShouldDetectBounds, setTooltipShouldDetectBounds] = useState(true);
    const [renderTooltipInPortal, setRenderTooltipInPortal] = useState(true);

    const { containerBounds, TooltipInPortal } = useTooltipInPortal({ // removed containerRef for now
        scroll: true,
        detectBounds: tooltipShouldDetectBounds
    })

    const { 
        tooltipOpen, 
        tooltipLeft, 
        tooltipTop, 
        tooltipData, 
        hideTooltip, 
        showTooltip } =
    useTooltip<TooltipData>();

    const TooltipComponent = renderTooltipInPortal
    ? TooltipInPortal
    : tooltipShouldDetectBounds
    ? TooltipWithBounds
    : Tooltip;

    // Slapped on the any types for now
    const handleMouseOver = (event: any, datum: any) => {
        const coords = localPoint(event);
        showTooltip({
            tooltipLeft: coords?.x,
            tooltipTop: coords?.y,
            tooltipData: datum
        })
    }

    // Determines the boxplot's "top" and "bottom" depending on orientation. Should be a continuous scale.
    const boxExtentScale = horizontal ? xScale : yScale;

    // Scale for spacing out multiple boxplots. Should be of scale type "band"
    const spacingScale = horizontal? yScale : xScale;

    //@ts-ignore
    const boxWidth = spacingScale.bandwidth();

    return (
        <>
        {/* Removed containerRef for now */}
        <svg width={xMax} height={yMax}>
            <Group top={0} pointerEvents="all">
                {data.map((d: BoxPlotStats, i) => (
                    <g key={i}>
                        {showViolinPlot && d.binData ? <ViolinPlot
                            data={d.binData}
                            stroke={sanitizeColor(violinPlotStroke)}
                            //@ts-ignore
                            left={(horizontal ? 0 : spacingScale(x(d))! + boxWidth / 8)}
                            //@ts-ignore
                            top={(horizontal ? spacingScale(x(d))! + boxWidth / 8 : 0)}
                            width={boxWidth * 3/4}
                            //@ts-ignore
                            valueScale={boxExtentScale}
                            fill={sanitizeColor(violinPlotFill)}
                            horizontal={horizontal} 
                        /> : null}
                        {showBoxPlot ? <BoxPlot
                            min={min(d)}
                            max={max(d)}
                            //@ts-ignore
                            left={(horizontal ? 0 : spacingScale(x(d))! + 0.3 * boxWidth)}
                            //@ts-ignore
                            top={(horizontal ? spacingScale(x(d))! + 0.3 * boxWidth : 0)}
                            firstQuartile={firstQuartile(d)}
                            thirdQuartile={thirdQuartile(d)}
                            median={median(d)}
                            boxWidth={boxWidth * 0.4}
                            fill={sanitizeColor(boxPlotFill)}
                            stroke={sanitizeColor(boxPlotStroke)}
                            strokeWidth={2}
                            //@ts-ignore
                            valueScale={boxExtentScale}
                            outliers={outliers(d)}
                            horizontal={horizontal}
                            minProps={{
                                onMouseMove: (event) => {handleMouseOver(event, {min: min(d), name: x(d)})},
                                onMouseLeave: () => {
                                    hideTooltip();
                                },
                             }}
                            maxProps={{
                                onMouseMove: (event) => {handleMouseOver(event, {max: max(d), name: x(d)})},
                                onMouseLeave: () => {
                                    hideTooltip();
                                },
                            }}
                            boxProps={{
                                onMouseMove: (event) => {handleMouseOver(event, {...d.boxPlot, name: x(d)})},
                                onMouseLeave: () => {
                                    hideTooltip();
                                },
                            }}
                            medianProps={{
                                style: {
                                    stroke: sanitizeColor(boxPlotStroke),
                                },
                                onMouseMove: (event) => {handleMouseOver(event, {median: median(d), name: x(d)})},
                                onMouseLeave: () => {
                                    hideTooltip();
                                },
                                }}
                            /> : null}
                        </g>
                    ))}
                </Group>
            </svg>
            {tooltipOpen && tooltipData && tooltipOn && (
                <TooltipComponent
                    key={Math.random()}
                    top={tooltipTop} 
                    left={tooltipLeft} 
                    style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white', fontFamily: "sans-serif" }}
                    offsetTop={80}
                >
                    <div>
                        <strong>{tooltipData?.name}</strong>
                    </div>
                    <div style={{ marginTop: '5px', fontSize: '12px' }}>
                        {tooltipData?.max && <div>max: {tooltipData?.max}</div>}
                        {tooltipData?.thirdQuartile && <div>third quartile: {tooltipData?.thirdQuartile}</div>}
                        {tooltipData?.median && <div>median: {tooltipData?.median}</div>}
                        {tooltipData?.firstQuartile && <div>first quartile: {tooltipData?.firstQuartile}</div>}
                        {tooltipData?.min && <div>min: {tooltipData?.min}</div>}
                    </div>
                </TooltipComponent>
            )}
        </>
    )
};
