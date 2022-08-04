import React, { useContext } from "react";
import { useState, useRef, useMemo } from "react";
import { MaticoDataContext } from "../../../Contexts/MaticoDataContext/MaticoDataContext";
import { MaticoPaneInterface } from "../Pane";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { Filter } from "../../../Datasets/Dataset";
import { useMaticoSelector } from "../../../Hooks/redux";
import { useNormalizeSpec } from "../../../Hooks/useNormalizeSpec";
import { MaticoChart } from "@maticoapp/matico_charts";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { View } from "@adobe/react-spectrum";
import { useRequestColumnStat } from "Hooks/useRequestColumnStat";

import {colors} from "Utils/colors"
import {Labels} from "@maticoapp/matico_types/spec";

export interface MaticoPieChartPaneInterface extends MaticoPaneInterface {
    dataset: { name: string; filters: Array<Filter> };
    column: string;
    theme?: string;
    editPath?: string;
    labels?: Labels
}

export const MaticoPieChartPane: React.FC<MaticoPieChartPaneInterface> = ({
    dataset,
    column = "",
    theme,
    editPath,
    labels
}) => {
    const { state: dataState } = useContext(MaticoDataContext);
    const [view, setView] = useState({});
    const chartRef = useRef();
    const containerRef = useRef();
    const edit = useIsEditable();

    const foundDataset = useMaticoSelector(
        (state) => state.datasets.datasets[dataset.name]
    );

    const padding = {
        top: 25,
        left: 40,
        bottom: 10,
        right: 10
    };


    const [mappedFilters, filtersReady, _] = useNormalizeSpec(dataset.filters);

    const [mappedStyle, styleReady] = useNormalizeSpec({});

    const dataRequest = foundDataset
        ? {
              datasetName: dataset.name,
              column,
              metric: "categoryCounts",
              filters: mappedFilters,
              parameters: { no_categories: 10 }
          }
        : null;


    const chartData = useRequestColumnStat(dataRequest);


    const Chart = useMemo(() => {
        if (!chartData || chartData.state !== "Done") {
            return <View>Loading</View>;
        }
        
        const pallet = colors.Pastel["10"] 
        const colMapping = chartData.result.reduce((agg,d,index) => ({...agg, [d.name] : pallet[index]} ),{})

        return (
            <MaticoChart
                layers={[
                    {
                        type: "pie",
                        color: (d)=>colMapping[d.name],
                        padding: 0.2,
                        innerRadius: 0.5,
                        valueAccessor: (d: any) => d.counts[0],
                        labelAccessor: (d: any) => d.name,
                        reverseSort: false,
                    }
                ]}
                categorical={true}
                data={chartData.result}
                {...labels}
            />
        );
    }, [JSON.stringify({ mappedStyle }), chartData]);

    if (!foundDataset) {
        return <div>{dataset.name} not found!</div>;
    }

    return (
        <View width="100%" height="100%" position="relative">
            {!foundDataset && <div>{dataset.name} not found!</div>}
            {Chart}
        </View>
    );
};
