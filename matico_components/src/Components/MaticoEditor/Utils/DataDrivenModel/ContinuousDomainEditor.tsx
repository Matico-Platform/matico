import { useRequestColumnStat } from "Hooks/useRequestColumnStat";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import {
    Flex,
    Item,
    NumberField,
    Picker,
    View,
    Well,
    Text
} from "@adobe/react-spectrum";
import { TwoUpCollapsableGrid } from "../TwoUpCollapsableGrid";
import { ColorPaletteSelector } from "../ColorPaletteSelector";
import { ColorPickerDialog } from "../ColorPickerDialog";
import { MaticoChart } from "@maticoapp/matico_charts";
import { DomainEditorProps } from ".";
import { scaleThreshold } from "d3-scale";
import { Color } from "chroma-js";
import { colors } from "Utils/colors";

export const ContinuousDomain: React.FC<DomainEditorProps> = ({
    dataset,
    mapping,
    column,
    rangeType,
    filters,
    onUpdateMapping
}) => {
    const domain = mapping.domain;
    const range = mapping.range;

    const metric = Array.isArray(domain.values)
        ? { type: "manual", bins: domain.values.length }
        : domain.values.metric;

    //@ts-ignore
    const noBins = metric.bins;

    let selectedPaletteName =
        typeof range.values === "string" ? range.values.split(".")[0] : null;

    let selectedPalette = selectedPaletteName
        ? //@ts-ignore
          colors[selectedPaletteName]
        : null;

    let rangeValues = Array.isArray(range.values)
        ? range.values
        : //@ts-ignore
          colors[selectedPaletteName][range.values.split(".")[1]];

    const [domainValues, setDomainValues] = useState<Array<number> | null>(
        Array.isArray(domain.values) ? domain.values : []
    );

    const quantiles = useRequestColumnStat({
        datasetName: dataset.name,
        column: column.name,
        metric: "quantile",
        parameters: { bins: noBins },
        filters: filters
    });

    const equalInterval = useRequestColumnStat({
        datasetName: dataset.name,
        column: column.name,
        metric: "equalInterval",
        parameters: { bins: noBins },
        filters: filters
    });

    const histogram = useRequestColumnStat({
        datasetName: dataset.name,
        column: column.name,
        metric: "histogram",
        parameters: { bins: 20 },
        filters: filters
    });

    useEffect(() => {
        if (
            metric.type === "quantile" &&
            quantiles &&
            quantiles.state === "Done"
        ) {
            setDomainValues(quantiles.result);
        }
        if (
            metric.type === "equalInterval" &&
            equalInterval &&
            equalInterval.state === "Done"
        ) {
            setDomainValues(equalInterval.result);
        }
        if (metric.type === "manual" && Array.isArray(domain.values)) {
            setDomainValues(domain.values);
        }
    }, [metric, noBins, quantiles, equalInterval, column]);

    const extent =
        histogram && histogram.state === "Done"
            ? [
                  histogram.result[0].binStart -
                      (histogram.result[0].binEnd -
                          histogram.result[0].binStart),
                  histogram.result[histogram.result.length - 1].binEnd
              ]
            : [];

    const updateQuantization = (quantization: string) => {
        if (quantization === "manual") {
            onUpdateMapping({
                ...mapping,
                domain: { ...domain, values: domainValues }
            });
        }
        if (quantization === "quantile") {
            onUpdateMapping({
                ...mapping,
                domain: {
                    ...domain,
                    values: {
                        dataset: dataset.name,
                        column: column.name,
                        metric: { type: "quantile", bins: noBins }
                    }
                }
            });
        }
        if (quantization === "equalInterval") {
            onUpdateMapping({
                ...mapping,
                domain: {
                    ...domain,
                    values: {
                        dataset: dataset.name,
                        column: column.name,
                        metric: { type: "equalInterval", bins: noBins }
                    }
                }
            });
        }
        console.warn(
            "Trying to set an unknown quantization method ",
            quantization
        );
    };

    const updateBins = (bins: number) => {
        console.log("updating bins", bins);
        let newRangeValues;
        if (Array.isArray(range)) {
            newRangeValues = _.range(bins).map((index) =>
                range[index] ? range[index] : [0, 0, 0]
            );
        } else {
            newRangeValues = `${selectedPaletteName}.${bins}`;
        }
        if (metric === "manual") {
            onUpdateMapping({
                ...mapping,
                range: { ...range, newRangeValues },
                domain: {
                    values: _.range(noBins).map((index: number) =>
                        domainValues[index] ? domainValues[index] : 0
                    )
                }
            });
        }
        if (metric === "quantile") {
            const newMapping = {
                ...mapping,
                range: { ...range, values: newRangeValues },
                domain: {
                    ...domain,
                    values: { metric: { type: "quantile", bins } }
                }
            };
            onUpdateMapping(newMapping);
        }
        if (metric === "equalInterval") {
            onUpdateMapping({
                ...mapping,
                range: { ...range, values: newRangeValues },
                domain: {
                    ...domain,
                    values: { metric: { type: "equalInterval", bins } }
                }
            });
        }
    };

    const updatePalette = (
        palette: { colors: Array<Color>; name: string },
        bins: number
    ) => {
        onUpdateMapping({
            ...mapping,
            range: { ...range, values: `${palette.name}.${bins}` }
        });
    };

    const updateRangeValForBin = (newVal: Color | number, binNo: Number) => {
        if (!Array.isArray(range.values)) return;
        const newRange = range.values.map(
            (val: Color | number, index: number) =>
                index === binNo ? newVal : val
        );
        onUpdateMapping({ ...mapping, range: { ...range, values: newRange } });
    };

    const updateValueForBin = (newVal: number, binNo: number) => {
        onUpdateMapping({
            ...mapping,
            domain: {
                //@ts-ignore
                ...domain,
                values: mapping.domain.values.map(
                    (val: number, index: number) =>
                        index === binNo ? newVal : val
                )
            }
        });
    };

    const sanitizedHistogramData =
        histogram?.result //@ts-ignore
            ?.filter((f) => f)
            .map((result: any) => ({
                ...result,
                count: isNaN(result.count) ? 0 : result.count
            })) || [];

    const colorFunc =
        quantiles?.result && rangeValues
            ? scaleThreshold()
                  .domain([...quantiles.result.slice(1), Math.pow(10, 10)])
                  .range(rangeValues)
            : () => "gray";

    console.log("domain values ", domainValues);
    console.log("range values ", rangeValues);
    console.log("range type", rangeType);

    return (
        <View overflow="hidden auto" marginTop="size-200">
            <h1>Continuous</h1>
            <TwoUpCollapsableGrid>
                <Flex direction="column" width="100%">
                    <TwoUpCollapsableGrid>
                        <Picker
                            width="100%"
                            selectedKey={metric.type}
                            onSelectionChange={(quant) =>
                                updateQuantization(quant as string)
                            }
                            label="Quantization"
                        >
                            <Item key="quantile">Quantiles</Item>
                            <Item key="continuous">Continuous</Item>
                            <Item key="equalInterval">Equal</Item>
                            <Item key="manual">Manual</Item>
                        </Picker>

                        <NumberField
                            width="100%"
                            value={noBins}
                            onChange={updateBins}
                            label="Number of breaks"
                            maxValue={9}
                            minValue={2}
                            step={1}
                        />
                    </TwoUpCollapsableGrid>
                    {rangeType === "color" && (
                        <ColorPaletteSelector
                            selectedPalette={{
                                name: selectedPaletteName,
                                colors: selectedPalette
                            }}
                            onSelectPalette={(palette) =>
                                updatePalette(palette, noBins)
                            }
                        />
                    )}
                </Flex>

                {["quantile", "equalInterval", "manual"].includes(
                    metric.type
                ) && (
                    <Well marginStart="size-300">
                        <Flex direction="column">
                            {domainValues &&
                                domainValues.map(
                                    (bin: number, index: number) => (
                                        <Flex>
                                            {rangeType === "color" &&
                                                rangeValues && (
                                                    <ColorPickerDialog
                                                        label=""
                                                        color={
                                                            typeof rangeValues[
                                                                index
                                                            ] === "string"
                                                                ? {
                                                                      hex: rangeValues[
                                                                          index
                                                                      ]
                                                                  }
                                                                : {
                                                                      rgb: rangeValues[
                                                                          index
                                                                      ]
                                                                  }
                                                        }
                                                        onColorChange={(
                                                            color
                                                        ) =>
                                                            updateRangeValForBin(
                                                                color,
                                                                index
                                                            )
                                                        }
                                                        width="size-450"
                                                        height="size-350"
                                                    />
                                                )}
                                            {metric === "manual" ? (
                                                <NumberField
                                                    aria-label={`Bin ${
                                                        index + 1
                                                    }`}
                                                    key={index}
                                                    value={bin}
                                                    labelPosition="side"
                                                    isDisabled={
                                                        metric !== "Manual"
                                                    }
                                                    onChange={(newVal) =>
                                                        updateValueForBin(
                                                            newVal,
                                                            index
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <Text
                                                    key={index}
                                                    marginX="size-200"
                                                    marginTop="size-50"
                                                >
                                                    {bin &&
                                                    index ===
                                                        domainValues.length - 1
                                                        ? `> ${
                                                              bin &&
                                                              bin.toFixed(1)
                                                          }`
                                                        : `${
                                                              domainValues[
                                                                  index
                                                              ] &&
                                                              domainValues[
                                                                  index
                                                              ].toFixed(1)
                                                          } to ${
                                                              domainValues[
                                                                  index + 1
                                                              ] &&
                                                              domainValues[
                                                                  index + 1
                                                              ].toFixed(1)
                                                          }`}
                                                </Text>
                                            )}
                                            {rangeType === "value" &&
                                                rangeValues && (
                                                    <NumberField
                                                        key={`values ${index}`}
                                                        value={
                                                            rangeValues[index]
                                                        }
                                                        onChange={(newVal) =>
                                                            updateRangeValForBin(
                                                                newVal,
                                                                index
                                                            )
                                                        }
                                                    />
                                                )}
                                        </Flex>
                                    )
                                )}
                        </Flex>
                    </Well>
                )}
            </TwoUpCollapsableGrid>

            {histogram && histogram.state === "Done" && (
                <Well marginTop="size-200">
                    <MaticoChart
                        // width={300}
                        height={200}
                        xExtent={extent}
                        xCol="binStart"
                        xLabel={column.name}
                        yLabel={"Count"}
                        yCol="freq"
                        data={sanitizedHistogramData}
                        xAxis={{
                            scaleType: "linear",
                            position: "bottom"
                        }}
                        yAxis={{
                            scaleType: "linear",
                            position: "left"
                        }}
                        // yExtent={[0,1500]}
                        grid={{ rows: true, columns: false }}
                        margin={{
                            top: 10,
                            bottom: 25,
                            left: 60,
                            right: 50
                        }}
                        layers={[
                            {
                                type: "bar",
                                color: (d: any) => colorFunc(d.binStart),
                                scale: 1,
                                padding: 0.1,
                                xAccessor: (d: any) =>
                                    (d.binEnd + d.binStart) / 2
                            }
                        ]}
                    />
                </Well>
            )}
        </View>
    );
};
