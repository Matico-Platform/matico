import React, { useMemo } from "react";
import { MaticoPaneInterface } from "../Pane";
import { DatasetState } from "Datasets/Dataset";
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

export interface MaticoLineChartPaneInterface extends MaticoPaneInterface {
    dataset: DatasetRef;
    xColumn: string;
    yColumn: string;
    lineColor?: ColorSpecification;
    // backgroundColor: string;
    lineWidth?: number;
    labels?: Labels;
}

export const MaticoLineChartPane: React.FC<MaticoLineChartPaneInterface> = ({
    dataset = {},
    xColumn = "",
    yColumn = "",
    lineColor = { hex: "#ff0000" },
    lineWidth = 1,
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
    if (typeof lineWidth === "object" && "variable" in lineWidth) {
        columns.push(lineWidth.variable);
    }
    if (typeof lineColor === "object" && "variable" in lineColor) {
        columns.push(lineColor.variable);
    }

    const paramsAreNull = dataset.name === "uknown" || columns.includes(null);
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
                type: "dateRange",
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
                type: "dateRange",
                value: "NoSelection"
            }
        },
        bind: true
    });

    const Chart = useMemo(() => {
        if (paramsAreNull) return null;
        const data = chartData?.state === "Done" ? chartData.result : [];
        if (!data || !data?.length) return null;

        const lineWidthFunc = generateNumericVar(lineWidth);
        const lineColorFunc = generateColorVar(lineColor);
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
                    position: "bottom",
                    tickFormatFunc: (d: number) => {
                        const date = new Date(d);
                        const month = date.getMonth() + 1;
                        const day = date.getDate();
                        const year = date.getFullYear().toString().slice(-2);
                        return `${month}/${day}/${year}`;
                    }
                }}
                yAxis={{
                    scaleType: "linear",
                    position: "left"
                }}
                grid={{ rows: true, columns: false }}
                layers={[
                    {
                        type: "line",
                        lineColor: "steelblue",
                        lineWidth: lineWidth
                    }
                ]}
                useBrush={{
                    horizontal: true,
                    vertical: false
                }}
                //@ts-ignore
                onBrush={({ x0, x1, y0, y1 }) => {
                    console.log(x0, x1);
                    updateXFilter(
                        x0 === x1
                            ? {
                                  type: "dateRange",
                                  value: "NoSelection"
                              }
                            : {
                                  type: "dateRange",
                                  value: {
                                      min: new Date(x0),
                                      max: new Date(x1)
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
    }, [chartData, lineColor, lineWidth]);

    return (
        <View position="relative" width="100%" height="100%">
            {!!paramsAreNull && (
                <MissingParamsPlaceholder paneName="Line Chart" />
            )}
            {Chart}
        </View>
    );
};
