import { DatasetSummary, Column } from "Datasets/Dataset";
import React, { useEffect, useState } from "react";
import { TwoUpCollapsableGrid } from "../TwoUpCollapsableGrid";
import { Flex, NumberField, View, Well, Text } from "@adobe/react-spectrum";
import { ColorPaletteSelector } from "../ColorPaletteSelector";
import { ColorPickerDialog } from "../ColorPickerDialog";
import { DomainEditorProps } from ".";
import { Color } from "chroma-js";
import { useRequestColumnStat } from "Hooks/useRequestColumnStat";
import { colors } from "Utils/colors";
import { getColorPallet } from "Components/Panes/MaticoMapPane/LayerUtils";
import { ColorSpecification } from "maplibre-gl";

export const DiscreteDomain: React.FC<DomainEditorProps> = ({
    dataset,
    mapping,
    column,
    rangeType,
    filters,
    onUpdateMapping
}) => {
    const domain = mapping.domain;
    const range = mapping.range;
    const [maxCategories, setMaxCategories] = useState(5);
    const [categories, setCategories] = useState<
        Array<{ name: string; count: number }>
    >([]);

    const [metric, metricParams] = Array.isArray(domain)
        ? ["manual", { no_categories: domain.length }]
        : [domain.type, domain];

    //@ts-ignore
    let noCategories = metricParams.no_categories;

    let selectedPaletteName =
        typeof range.values === "string" ? range.values.split(".")[0] : null;

    let selectedPalette = selectedPaletteName
        ? //@ts-ignore
          getColorPallet(selectedPaletteName)
        : null;

    let rangeValues = Array.isArray(range.values)
        ? range.values
        : //@ts-ignore
          selectedPalette;

    let categoryCounts = useRequestColumnStat({
        datasetName: dataset.name,
        column: domain.values.column,
        metric: "categoryCounts",
        parameters: {},
        filters: filters
    });

    useEffect(() => {
        if (categoryCounts) {
            setCategories(categoryCounts.result);
        }
    }, [maxCategories, column, categoryCounts]);

    const updatePalette = (
        palette: { colors: Array<Color>; name: string },
        bins: number
    ) => {
        onUpdateMapping({
            ...mapping,
            range: { ...range, values: `${palette.name}.${bins}` }
        });
    };

    const updateRangeValForBin = (
        newVal: ColorSpecification | number,
        binNo: Number
    ) => {
        const newRange = rangeValues.map(
            (val: ColorSpecification | number, index: number) =>
                index === binNo ? newVal : val
        );
        onUpdateMapping({ ...mapping, range: { ...range, values: newRange } });
    };
    return (
        <View overflow="hidden auto" marginTop="size-200">
            <h1>Discreate</h1>
            <TwoUpCollapsableGrid>
                <Flex direction="column" width="100%">
                    <TwoUpCollapsableGrid>
                        <NumberField
                            width="100%"
                            value={maxCategories}
                            onChange={setMaxCategories}
                            label="Number of categories to use"
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
                                updatePalette(palette, maxCategories)
                            }
                        />
                    )}
                </Flex>

                <Well marginStart="size-300">
                    <Flex direction="column">
                        {categories &&
                            categories.slice(0, noCategories).map(
                                (
                                    category: {
                                        name: string;
                                        count: number;
                                    },
                                    index: number
                                ) => (
                                    <Flex>
                                        {rangeType === "color" &&
                                            rangeValues && (
                                                <ColorPickerDialog
                                                    color={rangeValues[index]}
                                                    label={`${JSON.stringify(
                                                        category.name
                                                    )} (${category.count})`}
                                                    onColorChange={(color) =>
                                                        updateRangeValForBin(
                                                            color,
                                                            index
                                                        )
                                                    }
                                                    width="size-450"
                                                    height="size-350"
                                                />
                                            )}
                                        {rangeType === "value" &&
                                            rangeValues && (
                                                <NumberField
                                                    key={`values ${index}`}
                                                    value={rangeValues[index]}
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
            </TwoUpCollapsableGrid>
        </View>
    );
};
