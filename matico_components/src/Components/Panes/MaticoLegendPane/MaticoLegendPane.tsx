import { Divider, Flex, Heading, Text, View } from "@adobe/react-spectrum";
import React, { useMemo } from "react";
import { generateColor, getColorScale } from "../MaticoMapPane/LayerUtils";
import {
    scaleLinear,
    scaleOrdinal,
    scaleThreshold,
    scaleQuantile
} from "@visx/scale";
import {
    // Legend,
    LegendLinear,
    LegendQuantile,
    LegendOrdinal,
    LegendSize,
    LegendThreshold,
    LegendItem,
    LegendLabel
} from "@visx/legend";
import { colors } from "Utils/colors";
import _ from "lodash";

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

export const sanitizeColor = (color: string | number[] | undefined) => {
    if (!color) return null;
    if (typeof color === "string") return color;
    if (Array.isArray(color)) {
        return `rgb${color.length === 4 ? "a" : ""}(${color.join(",")})`;
    }
    return null;
};

const Legend: React.FC<{ layer: any }> = ({ layer = {} }) => {
    const { name, colorScale } = layer;

    const { range: colorsOrName, domain } = colorScale;

    const range = Array.isArray(colorsOrName)
        ? colorsOrName
        : _.get(colors, colorsOrName);
        
    if (!domain || !range) return null;

    const scale = scaleThreshold<number>({
        domain,
        range
    });

    return (
        <View>
            <Text UNSAFE_style={{fontWeight: 'bold'}}>{name}</Text>
            <LegendThreshold scale={scale} labelFormat={nicelyFormatNumber}>
                {(labels) => {
                    return labels.reverse().map((label, i) => (
                        <LegendItem
                            key={`legend-quantile-${i}`}
                            margin="1px 0"
                            // onClick={() => {
                            //   if (events) alert(`clicked: ${JSON.stringify(label)}`);
                            // }}
                        >
                            <svg width={20} height={20}>
                                <circle
                                    // @ts-ignore
                                    fill={sanitizeColor(label?.value)}
                                    r={8}
                                    cx={10}
                                    cy={10}
                                />
                            </svg>
                            <Text marginStart={"size-100"}>
                                {label.text}
                            </Text>
                        </LegendItem>
                    ));
                }}
            </LegendThreshold>
        </View>
    );
};

export const MaticoLegendPane: React.FC<{ layers: any[] }> = ({
    layers = []
}) => {
    const legends = useMemo(
        () =>
            layers.map((layer, i) => (
                <Flex key={i} direction="row">
                    <Legend layer={layer} />
                    {layers?.length > 1 && i < layers.length - 1 && (
                        <Divider
                            orientation="vertical"
                            size="M"
                            marginX="size-100"
                        />
                    )}
                </Flex>
            )),
        [JSON.stringify(layers)]
    );

    return layers && layers.length ? (
        <View
            position="absolute"
            right=".75em"
            bottom="1.5em"
            backgroundColor="default"
            padding="size-100"
        >
            <Flex direction="row">{legends}</Flex>
        </View>
    ) : null;
};
