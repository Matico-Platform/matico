import React, { useMemo } from "react";
import { MaticoPaneInterface } from "../Pane";
import { DatasetState, Filter } from "Datasets/Dataset";
import _ from "lodash";
import { useNormalizeSpec } from "Hooks/useNormalizeSpec";
import { useIsEditable } from "Hooks/useIsEditable";
import { useMaticoSelector } from "Hooks/redux";
import { useRequestData, useRequestDataMulti } from "Hooks/useRequestData";
import { MaticoLegendPane } from "../MaticoLegendPane/MaticoLegendPane";
import wkx from "wkx";
import { MaticoChart } from "@maticoapp/matico_charts";
import {
    generateColorVar,
    generateNumericVar
} from "../MaticoMapPane/LayerUtils";
import { View } from "@adobe/react-spectrum";
import {
    DatasetRef,
    Labels,
    Layer,
    MapProjection
} from "@maticoapp/matico_types/spec";
import { LoadingSpinner } from "Components/MaticoEditor/EditorComponents/LoadingSpinner/LoadingSpinner";

export interface MaticoStaticMapPaneInterface extends MaticoPaneInterface {
    dataset: DatasetRef;
    layers: Layer;
    projection: MapProjection;
    showGraticule: boolean;
    rotation: number;
    labels?: Labels;
}

export const StaticMapLayer: React.FC<Layer> = () => {
    return <></>;
};

export const MaticoStaticMapPane: React.FC<MaticoStaticMapPaneInterface> = ({
    dataset = {},
    layers = [],
    projection,
    showGraticule = false,
    id,
    rotation,
    labels
}) => {
    const edit = useIsEditable();

    const foundDataset = useMaticoSelector(
        (state) => state.datasets.datasets[dataset.name]
    );

    const datasetReady =
        foundDataset && foundDataset.state === DatasetState.READY;

    const chartData = useRequestDataMulti(
        layers.map((l) => ({
            datasetName: l.source?.name,
            filters: l.source?.filters,
            columns: l.source?.columns
        }))
    );

    const Chart = useMemo(() => {
        const styledLayers = layers
            .map((l: Layer, i: index) => {
                if (!chartData[i] || chartData[i].state !== "Done") {
                    return null;
                }
                const mappedData = chartData[i]?.result?.map((d: Record<string, any>) => {
                        let { geom, ...properties } = d;
                        if (!geom) return null;
                        let geoJSON = wkx.Geometry.parse(
                            Buffer.from(geom)
                        ).toGeoJSON();
                        return {
                            type: "Feature",
                            geometry: geoJSON,
                            properties
                        };
                    })
                    .filter((g) => g);

                const fillColor = generateColorVar(l?.style?.fillColor);
                const lineColor = generateColorVar(l?.style?.lineColor);
                const lineWidth = generateNumericVar(l?.style?.lineWidth);
                return {
                    fill: fillColor,
                    type: "map",
                    strokeColor: lineColor,
                    strokeWidth: lineWidth,
                    data: mappedData
                };
            })
            .filter((l) => l);

        return (
            <>
                <MaticoChart
                    title={labels?.title}
                    subtitle={labels?.subTitle}
                    yExtent={[0, 100]}
                    xExtent={[0, 100]}
                    proj={projection}
                    gratOn={showGraticule}
                    rotation={rotation}
                    layers={styledLayers}
                    data={[]}
                />
            </>
        );
    }, [chartData, showGraticule, layers, projection]);

    return (
        <View position="relative" width="100%" height="100%">
            {Chart}
            {/* @ts-ignore */}
            <MaticoLegendPane legends={layers?.map(l => ({...l, ...l.style}))||[]} />
        </View>
    );
};
