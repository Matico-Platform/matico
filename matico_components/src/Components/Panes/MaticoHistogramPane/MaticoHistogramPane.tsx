import React from "react";
import { useState, useMemo } from "react";
import { MaticoPaneInterface } from "../Pane";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { Filter } from "@maticoapp/matico_types/spec";
import { useMaticoSelector } from "../../../Hooks/redux";
import { useNormalizeSpec } from "../../../Hooks/useNormalizeSpec";
import { MaticoChart } from "@maticoapp/matico_charts";
import { useRequestColumnStat } from "Hooks/useRequestColumnStat";
import { generateColorVar } from "../MaticoMapPane/LayerUtils";
import { View } from "@adobe/react-spectrum";
import { useErrorsFor } from "Hooks/useErrors";
import { MaticoErrorType } from "Stores/MaticoErrorSlice";
import { HistogramEntry } from "@maticoapp/matico_types/api";
import { LoadingSpinner } from "Components/MaticoEditor/EditorComponents/LoadingSpinner/LoadingSpinner";
import { v4 as uuid } from "uuid";
import { MissingParamsPlaceholder } from "../MissingParamsPlaceholder/MissingParamsPlaceholder";

export interface MaticoHistogramPaneInterface extends MaticoPaneInterface {
    dataset: { name: string; filters: Array<Filter> };
    column: string;
    color?: string;
    maxbins?: number;
    labels?: { [name: string]: string };
}

const backgroundColor = "#fff";

export const MaticoHistogramPane: React.FC<MaticoHistogramPaneInterface> = ({
    dataset,
    column = "",
    color,
    maxbins,
    labels,
    id
}) => {
    const [view, setView] = useState({});
    const rangeVariableId = useMemo(() => uuid(), []);

    const { errors, throwError, clearErrors } = useErrorsFor(
        id,
        MaticoErrorType.PaneError
    );
    const paramsAreNull = !dataset?.name || !column?.length;

    const [columnFilter, updateFilter] = useAutoVariable({
        variable: {
            id: id + "_range",
            paneId: id,
            name: `${column}_range`,
            value: {
                type: "range",
                value: "NoSelection"
            }
        },
        bind: true
    });

    const foundDataset = useMaticoSelector(
        (state) => state.datasets.datasets[dataset.name]
    );

    const datasetReady = foundDataset && foundDataset.state === "READY";

    const dataRequest = foundDataset
        ? {
              datasetName: dataset.name,
              column,
              metric: "histogram",
              filters: dataset.filters,
              parameters: { bins: maxbins }
          }
        : null;

    const chartData = useRequestColumnStat(dataRequest);

    const Chart = useMemo(() => {
        if (!chartData || chartData.state !== "Done") {
            return <LoadingSpinner />;
        }
        const data: Array<HistogramEntry> = chartData.result.filter(
            (c: HistogramEntry) => c.freq
        );

        const extent = [
            data[0].binStart - (data[0].binEnd - data[0].binStart),
            data[data.length - 1].binEnd
        ];

        const colorMap = generateColorVar(color);

        return (
            <MaticoChart
                xExtent={extent}
                xCol="binStart"
                xLabel={labels?.x_label ?? column}
                yLabel={labels?.y_label ?? "counts"}
                yCol="freq"
                title={labels?.title}
                subtitle={labels?.sub_title}
                attribution={labels?.attribution}
                data={data}
                xAxis={{
                    scaleType: "linear",
                    position: "bottom"
                }}
                grid={{ rows: true, columns: false }}
                useBrush={{
                    vertical: false,
                    horizontal: true
                }}
                //@ts-ignore
                onBrush={({ x0, x1 }) =>
                    updateFilter(
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
                    )
                }
                layers={[
                    {
                        type: "bar",
                        //@ts-ignore
                        color: (d) => {
                            let c = colorMap(d.binMid);
                            return [c[0], c[1], c[2]];
                        },
                        scale: 11,
                        xAccessor: (d: any) => d.binEnd
                    }
                ]}
            />
        );
    }, [JSON.stringify({ labels, color, backgroundColor }), chartData]);

    return (
        <View width="100%" height="100%" position="relative">
            {!!paramsAreNull ? (
                <MissingParamsPlaceholder paneName="Histogram" />
            ) : !datasetReady ? (
                <div>{dataset.name} not found!</div>
            ) : (
                Chart
            )}
        </View>
    );
};
