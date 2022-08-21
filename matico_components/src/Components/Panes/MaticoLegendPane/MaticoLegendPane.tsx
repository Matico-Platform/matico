import { Divider, Flex, Text, View } from "@adobe/react-spectrum";
import React, { useMemo } from "react";
import { scaleThreshold } from "@visx/scale";
import { LegendThreshold, LegendItem } from "@visx/legend";
import { colors } from "Utils/colors";
import { get } from "lodash";
import { sanitizeColor } from "Utils/sanitizeColor";

// interface MaicoMapPaneInterface extends MaticoPaneInterface {
//     view: View;
//     //TODO WE should properly type this from the @maticoapp/matico_spec library. Need to figure out the Typescript integration better or witx
//     base_map?: any;
//     layers?: Array<any>;
//     editPath?: string;
// }

export function nicelyFormatNumber(x: number | string) {
    const val = +x;
    if (!x || isNaN(val)) return x;
    if (val < 0.0001) return val.toExponential();
    if (val < 0.01) return val.toFixed(4);
    if (val < 1) return val.toFixed(3);
    if (val < 10) return val.toFixed(2);
    if (val < 100) return val.toFixed(1);
    if (val < 1_000) return val.toFixed(0);
    if (val < 10_000) return `${(val / 1_000).toFixed(1)}K`;
    if (val < 1_000_000) return `${(val / 1_000).toFixed(0)}K`;
    if (val < 1_000_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val < 1_000_000_000_000) return `${(val / 1_000_000).toFixed(1)}B`;
    return val.toExponential();
}

const Rect: React.FC<{ children: React.ReactChildren }> = ({ children }) => (
    <rect>{children}</rect>
);
const Circle: React.FC<{ children: React.ReactChildren }> = ({ children }) => (
    <circle>{children}</circle>
);
const Line: React.FC<{ children: React.ReactChildren }> = ({ children }) => (
    <line>{children}</line>
);

const ENTRY_SYMBOL_WIDTH = 20;
const ENTRY_SYMBOL_HEIGHT = 20;

type ScaleFunc = (x: number) => { [key: string]: any };
//@ts-ignore
const useLegend = (
    layer: any
): {
    name: string;
    legendEl: string;
    getLegendItemProps: (value: number) => { [key: string]: any };
    scale: any;
} => {
    let legendEl = "rect";

    const { fillColor, lineColor, lineWidth, size, name} = layer;

    let steps: { scale: any; operation: ScaleFunc }[] = [];


    if (fillColor?.domain) {
        const { domain, range: valuesOrName } = fillColor;
        const range = Array.isArray(valuesOrName)
            ? valuesOrName
            : get(colors, valuesOrName);

        const scale = scaleThreshold<number>({
            domain: domain && Array.isArray(domain)  ? [...domain.slice(1), Math.pow(10, 10)] :[],
            range
        });

        steps.push({
            scale,
            operation: (value: number) => ({
                fill: sanitizeColor(scale(value) as string | number[])
            })
        });
    }
    if (lineColor?.domain) {
        const { domain, range: valuesOrName } = lineColor;
        const range = Array.isArray(valuesOrName)
            ? valuesOrName
            : get(colors, valuesOrName);
        const scale = scaleThreshold<number>({
            domain: domain && Array.isArray(domain) ? [...domain.slice(1), Math.pow(10, 10)] : [],
            range
        });
        steps.push({
            scale,
            operation: (value: number) => ({
                stroke: sanitizeColor(scale(value) as string | number[])
            })
        });
    }
    if (lineWidth?.domain) {
        const { domain } = lineWidth;
        if (domain) {
            const max = Math.max(...domain);

            const range = domain.map(
                //@ts-ignore
                (step) => (step / max) * (ENTRY_SYMBOL_WIDTH / 4 - 1) + 1
            );
            const scale = scaleThreshold<number>({
                domain: domain && Array.isArray(domain) ? [...domain.slice(1), Math.pow(10, 10)] : [],
                range
            });
            steps.push({
                scale,
                operation: (value: number) => ({
                    strokeWidth: scale(value) as string | number[]
                })
            });
        }
    }
    if (size?.domain) {
        legendEl = "circle";
        const { domain } = size;
        if (domain) {
            const max = Math.max(...domain);

            const range = domain.map(
                //@ts-ignore
                (step) => (step / max) * (ENTRY_SYMBOL_WIDTH / 2 - 3) + 3
            );
            const scale = scaleThreshold<number>({
                domain: domain && Array.isArray(domain) ? [...domain.slice(1), Math.pow(10, 10)] : [],
                range
            });
            steps.push({
                scale,
                operation: (value: number) => ({
                    r: scale(value) as string | number[],
                    cx: ENTRY_SYMBOL_WIDTH / 2,
                    cy: ENTRY_SYMBOL_HEIGHT / 2
                })
            });
        }
    } else {
        steps.push({
            scale: null,
            operation: (value: number) => ({
                width: 20,
                height: 20
            })
        });
    }

    const getLegendItemProps = (value: number) =>
        steps.reduce(
            (props, step) => ({
                ...props,
                ...step.operation(value)
            }),
            {}
        );

    return {
        name,
        legendEl,
        scale: steps[0]?.scale,
        getLegendItemProps
    };
};

const Legend: React.FC<{ layer: any }> = ({ layer = {} }) => {
    const { name, legendEl, scale, getLegendItemProps } = useLegend(layer);

    if (!scale) {
        return null;
    } else {
        return (
            <View>
                <Text UNSAFE_style={{ fontWeight: "bold" }}>{name}</Text>
                <LegendThreshold scale={scale} labelFormat={nicelyFormatNumber}>
                    {(labels) => {
                        //@ts-ignore
                        return labels
                            .sort(
                                (a, b) =>
                                    (isNaN(+a?.datum) ? 0 : +a?.datum) -
                                    (isNaN(+b?.datum) ? 0 : +b?.datum)
                            )
                            .reverse()
                            .map((label, i) => {
                                const val: number =
                                    label.datum !== undefined
                                        ? (label.datum as number)
                                        : //@ts-ignore
                                          (label?.extent[1] || 0) - 0.000000001;

                                return (
                                    <LegendItem
                                        key={`legend-quantile-${i}`}
                                        margin="1px 0"
                                        // onClick={() => {
                                        //   if (events) alert(`clicked: ${JSON.stringify(label)}`);
                                        // }}
                                    >
                                        <svg
                                            width={ENTRY_SYMBOL_WIDTH}
                                            height={ENTRY_SYMBOL_HEIGHT}
                                        >
                                            {legendEl === "rect" ? (
                                                <rect
                                                    {...getLegendItemProps(val)}
                                                />
                                            ) : (
                                                <circle
                                                    {...getLegendItemProps(val)}
                                                />
                                            )}
                                        </svg>
                                        <Text marginStart={"size-100"}>
                                            {i > 0 ? label.text : `> ${val}`}
                                        </Text>
                                    </LegendItem>
                                );
                            });
                    }}
                </LegendThreshold>
            </View>
        );
    }
};

export const MaticoLegendPane: React.FC<{ legends: Array<any> }> = ({
    legends= [] 
}) => {
    const legendPanes = useMemo(
      () =>{
            return legends.map((legend, i) => (
                <Flex key={i} direction="row">
                    <Legend layer={legend} />
                    {legends?.length > 1 && i < legends.length - 1 && (
                        <Divider
                            orientation="vertical"
                            size="M"
                            marginX="size-100"
                        />
                    )}
                </Flex>
            ))
        },
        // @ts-ignore
        [JSON.stringify(legends)]
    );


    return legends && legends.length ? (
        <View
            position="absolute"
            right=".75em"
            bottom="1.5em"
            backgroundColor="default"
            padding="size-100"
        >
            <Flex direction="row">{legendPanes}</Flex>
        </View>
    ) : null;
};
