import * as React from 'react';
import { useState } from 'react';
import { Group } from '@visx/group';
import { ViolinPlot, BoxPlot } from '@visx/stats';
import { useTooltip, useTooltipInPortal, defaultStyles as defaultTooltipStyles, Tooltip, TooltipWithBounds } from '@visx/tooltip';
import { DistributionSpec, PlotLayersProperties, BoxPlotStats } from "../../types";
import { sanitizeColor } from '../../../Utils';
import { localPoint } from '@visx/event'
//import { Stats } from '@visx/mock-data/lib/generators/genStats';

// function formatColor (color:ColorOutput) {
//   if (typeof color == "string") {
//     return color;
//   } else if (Array.isArray(color)) {
//     let prefix = color.length === 3 ? "rgb" : "rgba"
//     return `${prefix}(${color.join(",")})`;
//   }
// }

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
    // We set boundary detection to true and rendering in portal to false
    // Need to see if the tooltip will cover the box or hide under it when
    // we turn renderTooltipInPortal to true
    const [tooltipShouldDetectBounds, setTooltipShouldDetectBounds] = useState(true);
    const [renderTooltipInPortal, setRenderTooltipInPortal] = useState(true);

    const { containerRef, containerBounds, TooltipInPortal } = useTooltipInPortal({
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
    // If renderTooltipInPortal is true, then TooltipComponent is assigned TooltipInPortal
    // If instead false, then we check tooltipShouldDetectBounds 


    // Slapped on the any types for now
    const handleMouseOver = (event: any, datum: any) => {
        const coords = localPoint(event);
        showTooltip({
            tooltipLeft: coords?.x,
            tooltipTop: coords?.y,
            tooltipData: datum
        })
    }
    

    // Computing the min/max of the data
    // const values = data.reduce((allValues, { boxPlot }) => {
    //   allValues.push(boxPlot.min, boxPlot.max, Math.min(...boxPlot.outliers), Math.max(...boxPlot.outliers));
    //   return allValues;
    // }, [] as number[]);
    // const minValue = Math.min(...values);
    // const maxValue = Math.max(...values);

    // Determines the boxplot's "top" and "bottom" depending on orientation. Should be a continuous scale.
    const boxExtentScale = horizontal ? xScale : yScale;
    
    // scaleLinear<number>({
    //   range: (horizontal ? [0, xMax] : [yMax, 0]),
    //   round: true,
    //   domain: yExtent ? yExtent : [minValue, maxValue]
    // });

    // Scale for spacing out multiple boxplots. Should be of scale type "band"
    const spacingScale = horizontal? yScale : xScale;
    
    // scaleBand<string>({
    //   range: [0, (horizontal ? yMax : xMax)],
    //   round: true,
    //   domain: data.map(x),
    //   padding: 0.25
    // });

    //@ts-ignore
    const boxWidth = spacingScale.bandwidth();

    return (
        <>
        <svg ref={containerRef} width={xMax} height={yMax}>
            <Group top={0} pointerEvents="all">
                {data.map((d: BoxPlotStats, i) => (
                    <g key={i}>
                        {showViolinPlot ? <ViolinPlot
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
                                    onMouseMove: (event) => {
                                        const coords = localPoint(event);
                                        showTooltip({
                                            tooltipLeft: coords?.x,
                                            tooltipTop: coords?.y,
                                            // tooltipTop: horizontal
                                            //     //@ts-ignore                                   
                                            //     ? spacingScale(x(d))! + (boxWidth / 4)
                                            //     //@ts-ignore
                                            //     : (boxExtentScale(min(d))) - 50, // - (boxWidth / 2)
                                            // tooltipLeft: horizontal 
                                            //     //@ts-ignore
                                            //     ? (boxExtentScale(min(d))) - boxWidth
                                            //     //@ts-ignore
                                            //     : spacingScale(x(d))! + (boxWidth / 2),
                                            tooltipData: {
                                                min: min(d),
                                                name: x(d),
                                            }
                                        })
                                    },
                                    onMouseLeave: () => {
                                        hideTooltip();
                                    },
                             }}
                            maxProps={{
                                    onMouseMove: (event) => {
                                        const coords = localPoint(event);
                                        showTooltip({
                                            tooltipLeft: coords?.x,
                                            tooltipTop: coords?.y,
                                            // tooltipTop: horizontal
                                            //     //@ts-ignore
                                            //     ? spacingScale(x(d))! + (boxWidth / 4)
                                            //     //@ts-ignore
                                            //     : (boxExtentScale(max(d))) - 50, // - (boxWidth / 2)
                                            // tooltipLeft: horizontal 
                                            //     //@ts-ignore
                                            //     ? (boxExtentScale(max(d)))! // - boxWidth
                                            //     //@ts-ignore
                                            //     : spacingScale(x(d))! + (boxWidth / 2),
                                            tooltipData: {
                                                max: max(d),
                                                name: x(d),
                                            }
                                        })
                                    },
                                    onMouseLeave: () => {
                                        hideTooltip();
                                    },
                            }}
                            boxProps={{
                                    onMouseMove: (event) => {
                                        const coords = localPoint(event);
                                        showTooltip({
                                            tooltipLeft: coords?.x,
                                            tooltipTop: coords?.y,
                                            // tooltipTop: horizontal
                                            //     //@ts-ignore
                                            //     ? spacingScale(x(d))! + (boxWidth / 4)
                                            //     //@ts-ignore
                                            //     : (boxExtentScale(thirdQuartile(d))) -50,// - (boxWidth)
                                            // tooltipLeft: horizontal 
                                            //     //@ts-ignore
                                            //     ? (boxExtentScale(thirdQuartile(d))) - (boxWidth)
                                            //     //@ts-ignore
                                            //     : spacingScale(x(d))! + (boxWidth / 2),
                                            tooltipData: {
                                                ...d.boxPlot,
                                                name: x(d),
                                            }
                                        })
                                    },
                                    onMouseLeave: () => {
                                        hideTooltip();
                                    },
                            }}
                            medianProps={{
                                    style: {
                                        stroke: sanitizeColor(boxPlotStroke),
                                    },
                                    onMouseMove: (event) => {
                                        const coords = localPoint(event);
                                        showTooltip({
                                            tooltipLeft: coords?.x,
                                            tooltipTop: coords?.y,
                                            // tooltipTop: horizontal
                                            //     //@ts-ignore
                                            //     ? spacingScale(x(d))! + (boxWidth / 4)
                                            //     //@ts-ignore
                                            //     : (boxExtentScale(median(d))) - 50,// - (boxWidth / 2)
                                            // tooltipLeft: horizontal 
                                            //     //@ts-ignore
                                            //     ? (boxExtentScale(median(d))) - boxWidth
                                            //     //@ts-ignore
                                            //     : spacingScale(x(d))! + (boxWidth / 2),
                                            tooltipData: {
                                                median: median(d),
                                                name: x(d),
                                            }
                                        })
                                    },
                                    onMouseLeave: () => {
                                        hideTooltip();
                                    },
                                }}
                            /> : null}
                        </g>
                    ))}
                </Group>
            </svg>
            {tooltipOpen && tooltipData && (
                <TooltipComponent
                    key={Math.random()} // apparently necessary for tooltip
                    top={tooltipTop} 
                    left={tooltipLeft} 
                    style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white' }}
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
