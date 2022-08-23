import React, { useMemo } from "react";
import { MaticoPaneInterface } from "../Pane";
import { DatasetState, Filter } from "Datasets/Dataset";
import _ from "lodash";
import { useNormalizeSpec } from "Hooks/useNormalizeSpec";
import { useIsEditable } from "Hooks/useIsEditable";
import { useMaticoSelector } from "Hooks/redux";
import { useRequestData } from "Hooks/useRequestData";
import { useAutoVariable } from "Hooks/useAutoVariable";
import { MaticoChart } from "@maticoapp/matico_charts";
import {
    generateColorVar,
    generateNumericVar
} from "../MaticoMapPane/LayerUtils";
import { Text, Flex, View } from "@adobe/react-spectrum";
import {
    ColorSpecification,
    DatasetRef,
    Labels
} from "@maticoapp/matico_types/spec";
import { MissingParamsPlaceholder } from "../MissingParamsPlaceholder/MissingParamsPlaceholder";

export interface MaticoScatterplotPaneInterface extends MaticoPaneInterface {
    dataset: DatasetRef;
    xColumn: string;
    yColumn: string;
    dotColor?: ColorSpecification;
    // backgroundColor: string;
    dotSize?: number;
    labels?: Labels;
}

export const MaticoScatterplotPane: React.FC<MaticoScatterplotPaneInterface> =
    ({
        dataset = {},
        xColumn = "",
        yColumn = "",
        dotColor = { hex: "#ff0000" },
        dotSize = 1,
        id,
        labels
    }) => {
        const edit = useIsEditable();

        const foundDataset = useMaticoSelector(
            (state) => state.datasets.datasets[dataset.name]
        );
        const datasetReady =
            foundDataset && foundDataset.state === DatasetState.READY;

        let columns = [xColumn, yColumn];
        if (typeof dotSize === "object" && "variable" in dotSize) {
            columns.push(dotSize.variable);
        }
        if (typeof dotColor === "object" && "variable" in dotColor) {
            columns.push(dotColor.variable);
        }

        const paramsAreNull =
            dataset.name === "uknown" || columns.includes(null);
        const chartData = useRequestData({
            datasetName: dataset.name,
            filters: dataset.filters,
            columns
        });

        const [
            xFilter,
            updateXFilter
            //@ts-ignore
        ] = useAutoVariable({
            variable: {
                name: `${xColumn}_range`,
                id: id + "x_filter",
                paneId: id,
                value: {
                    type: "range",
                    value: "NoSelection"
                }
            },
            bind: true
        });

        const [
            yFilter,
            updateYFilter
            //@ts-ignore
        ] = useAutoVariable({
            variable: {
                name: `${yColumn}_range`,
                id: id + "y_filter",
                paneId: id,
                value: {
                    type: "range",
                    value: "NoSelection"
                }
            },
            bind: true
        });

        const Chart = useMemo(() => {
            if (paramsAreNull) return null;
            const data = chartData?.state === "Done" ? chartData.result : [];

            if (!data || !data?.length) return null;

            const dotSizeFunc = generateNumericVar(dotSize);
            const dotColorFunc = generateColorVar(dotColor);

            const xVals = data.map((d: Record<string, unknown>) => d[xColumn]);
            const yVals = data.map((d: Record<string, unknown>) => d[yColumn]);

            const xExtent = [Math.min(...xVals), Math.max(...xVals)];

            const yExtent = [Math.min(...yVals), Math.max(...yVals)];

            return (
                <MaticoChart
                    xExtent={xExtent}
                    yExtent={yExtent}
                    xLabel={labels?.xLabel ?? xColumn}
                    yLabel={labels?.yLabel ?? yColumn}
                    xCol={xColumn}
                    yCol={yColumn}
                    title={labels?.title ?? `${xColumn} vs ${yColumn}`}
                    subtitle={labels?.subTitle}
                    attribution={labels?.attribution}
                    data={data}
                    xAxis={{
                        scaleType: "linear",
                        position: "bottom"
                    }}
                    yAxis={{
                        scaleType: "linear",
                        position: "left"
                    }}
                    grid={{ rows: true, columns: false }}
                    layers={[
                        {
                            type: "scatter",
                            color: dotColorFunc,
                            scale: dotSizeFunc
                        }
                    ]}
                    useBrush={{
                        horizontal: true,
                        vertical: true
                    }}
                    //@ts-ignore
                    onBrush={({ x0, x1, y0, y1 }) => {
                        updateXFilter(
                            x0 === x1
                                ? {
                                      type: "range",
                                      value: "NoSelection"
                                  }
                                : {
                                      type: "range",
                                      value: {
                                          min: x0,
                                          max: x1
                                      }
                                  }
                        );
                        updateYFilter(
                            y0 === y1
                                ? {
                                      type: "range",
                                      value: "NoSelection"
                                  }
                                : {
                                      type: "range",
                                      value: {
                                          min: y0,
                                          max: y1
                                      }
                                  }
                        );
                    }}
                />
            );
        }, [chartData, dotColor, dotSize]);

        return (
            <View position="relative" width="100%" height="100%">
                {!!paramsAreNull && (
                    <MissingParamsPlaceholder paneName="Scatterplot" />
                )}
                {Chart}
            </View>
        );
    };
