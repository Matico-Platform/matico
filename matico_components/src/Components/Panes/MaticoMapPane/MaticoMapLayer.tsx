import React, { useContext, useEffect, useMemo } from "react";
import { GeomType } from "../../../Datasets/Dataset";
import { AutoVariableInterface, useAutoVariable } from "Hooks/useAutoVariable";
import traverse from "traverse";
import {
    ScatterplotLayer,
    PathLayer,
    PolygonLayer,
    BitmapLayer
} from "@deck.gl/layers";
import {
    convertPoint,
    convertLine,
    expandMultiAndConvertPoly,
    generateColorVar,
    generateNumericVar
} from "./LayerUtils";
import { useNormalizeSpec } from "../../../Hooks/useNormalizeSpec";
import { useRequestData } from "Hooks/useRequestData";
import { useMaticoSelector } from "Hooks/redux";
import { MVTLayer, TileLayer } from "deck.gl";
import { Filter } from "@maticoapp/matico_types/spec";

interface MaticoLayerInterface {
    name: string;
    source: { name: string; filters?: Array<Filter> };
    style: any;
    onUpdate: (layerState: any) => void;
    mapName: string;
    beforeId?: string;
}

export const MaticoMapLayer: React.FC<MaticoLayerInterface> = ({
    source,
    style,
    name,
    mapName,
    onUpdate,
    beforeId
}) => {
    const dataset = useMaticoSelector(
        (state) => state.datasets.datasets[source.name]
    );

    const [hoverVariable, updateHoverVariable] = useAutoVariable({
        name: `${mapName}_map_${name}_hover`,
        type: "any",
        initialValue: null,
        bind: true
    } as AutoVariableInterface);

    const [clickVariable, updateClickVariable] = useAutoVariable({
        name: `${mapName}_map_${name}_click`,
        type: "any",
        initialValue: null,
        bind: true
    } as AutoVariableInterface);

    let requiredCols: Array<string> = [];
    traverse(style).forEach(function (node: any) {
        if (this && this.key === "variable") {
            requiredCols.push(node);
        }
    });
    

    const dataResult = useRequestData(
      {datasetName: dataset.tiled === false ? source.name : null,
        filters: source.filters,
        columns:[...requiredCols, "geom"]
      });


    const preparedData = useMemo(() => {
        if (!dataResult) {
            return [];
        }
        if (dataResult.state !== "Done") {
            return [];
        }
        if (dataset && dataset.tiled === true) {
            return [];
        }

        switch (dataset.geomType) {
            case GeomType.Point:
                self.performance.mark("prep_geom_point_start");
                let points_result = dataResult.result.map((d: any) => ({
                    ...d,
                    geom: convertPoint(d.geom)
                }));
                self.performance.mark("prep_geom_point_end");
                self.performance.measure(
                    "prep_point_geom",
                    "prep_geom_point_start",
                    "prep_geom_point_end"
                );
                return points_result;
            case GeomType.Polygon:
                self.performance.mark("prep_geom_polygon_start");
                let poly_result = expandMultiAndConvertPoly(dataResult.result);
                self.performance.mark("prep_geom_polygon_end");
                self.performance.measure(
                    "prep_polygon_geom",
                    "prep_geom_polygon_start",
                    "prep_geom_polygon_end"
                );
                return poly_result;
            case GeomType.Line:
                return dataResult.result.map((d: any) => ({
                    ...d,
                    geom: convertLine(d.geom)
                }));
        }
    }, [source.name, dataResult, dataset]);

    useEffect(() => {

        //If we the dataset is tiled and we dont have data
        //return
        if (!dataset.tiled) {
            if (!dataResult || dataResult.state !== "Done") {
                return;
            }
        }

        let layer = undefined;
        const fillColor = generateColorVar(style.fillColor, true) ?? [
            255, 0, 0, 100
        ];

        const lineColor = generateColorVar(style.lineColor, true) ?? [
            0, 255, 0, 100
        ];
        const lineWidth = generateNumericVar(style.lineWidth);
        const lineWidthUnits = style.lineUnits ?? "pixels";
        const lineWidthScale = style.lineWidthScale ?? 1;
        const elevation = generateNumericVar(style.elevation) ?? 0;
        const elevationScale =
            generateNumericVar(style.elevationScale) ?? 1;
        const opacity = style.opacity ?? 1;
        const visible = style.visible ?? true;
        const shouldExtrude =
            elevation !== null &&
            (elevation > 0 || typeof elevation === "function");
        const shouldStroke =
            lineWidth !== null &&
            (lineWidth > 0 || typeof lineWidth === "function");

        const common = {
            getFillColor: (d: Record<string, unknown>) => {
                try {
                    let color;
                    if (typeof fillColor === "function") {
                        color = fillColor(d);
                    }
                    else{
                      color = fillColor;
                    }
                    return [color[0], color[1], color[2],color[3]*255]
                } catch {
                    return [0, 0, 0, 0];
                }
            },
            getLineColor:  (d: Record<string, unknown>) => {
                try {
                    let color;
                    if (typeof lineColor === "function") {
                        color = lineColor(d);
                    }
                    else{
                      color = lineColor;
                    }
                    return [color[0], color[1], color[2],color[3]*255]
                } catch {
                    return [0, 0, 0, 0];
                }
            },
            getLineWidth: lineWidth === null ? 10 : lineWidth,
            lineWidthUnits,
            lineWidthScale,
            extruded: shouldExtrude,
            stroked: shouldStroke,
            getElevation: elevation,
            elevationScale,
            opacity,
            visible,
            onHover: (hoverTarget: { object: Record<string, unknown> }) =>
                updateHoverVariable(hoverTarget.object),
            onClick: (clickTarget: { object: Record<string, unknown> }) =>
                updateClickVariable(clickTarget.object),
            pickable: true,
            id: name,
            beforeId: beforeId,
            data: dataset.tiled ? dataset.mvtUrl : preparedData,
            updateTriggers: {
                getFillColor: [JSON.stringify(style.fillColor)],
                getLineColor: [JSON.stringify(style.lineColor)],
                getRadius: [JSON.stringify(style.size)],
                getElevation: [JSON.stringify(style.elevation)],
                getLineWidth: [
                    JSON.stringify(style.lineWidth),
                    JSON.stringify(style.lineUnits)
                ],
                extruded: [JSON.stringify(shouldExtrude)],
                stroked: [JSON.stringify(shouldStroke)]
            },
            _legend: {
                name: name,
                fillColor: {
                    domain: style?.fillColor?.domain,
                    range: style?.fillColor?.range
                },
                lineColor: {
                    domain: style?.lineColor?.domain,
                    range: style?.lineColor?.range
                },
                lineWidth: {
                    domain: style?.lineWidth?.domain,
                    range: style?.lineWidth?.range
                },
                size: {
                    domain: style?.size?.domain,
                    range: style?.size?.range
                }
            }
        };
        if (!dataset.tiled) {
            switch (dataset.geomType) {
                case GeomType.Point:
                    const getRadius = generateNumericVar(style.size);
                    const radiusScale = generateNumericVar(
                        style.radiusScale
                    );
                    layer = new ScatterplotLayer({
                        filled: true,
                        radiusUnits: style.radiusUnits
                            ? style.radiusUnits
                            : "meters",
                        getRadius: getRadius === null ? 20 : getRadius,
                        //@ts-ignore
                        radiusScale: radiusScale === null ? 1 : radiusScale,
                        //@ts-ignore
                        getPosition: (d: unknown) => d.geom,
                        ...common
                        //@ts-ignore
                    });
                    break;
                case GeomType.Line:
                    layer = new PathLayer({
                        widthScale: lineWidthScale,
                        widthUnits: lineWidthUnits,
                        getWidth: lineWidth,
                        getColor: lineColor,
                        getPath: (d) => d.geom,
                        ...common,
                        updateTriggers: {
                            widthScale: [
                                JSON.stringify(style.lineWidthScale)
                            ],
                            widthUnits: [
                                JSON.stringify(style.lineWidthUnits)
                            ],
                            getWidth: [JSON.stringify(style.lineWidth)],
                            getColor: [JSON.stringify(style.lineColor)]
                        }
                    });
                    break;
                case GeomType.Polygon:
                    //@ts-ignore
                    layer = new PolygonLayer({
                        //@ts-ignore
                        getPolygon: (d) => d.geom,
                        filled: true,
                        ...common
                    });
                    break;
            }
        } else {
            if (dataset.raster) {
                layer = new TileLayer({
                    id: name,
                    data: dataset.mvtUrl,
                    minZoom: 0,
                    maxZoom: 19,
                    tileSize: 256,

                    renderSubLayers: (props) => {
                        const {
                            bbox: { west, south, east, north }
                        } = props.tile;

                        return new BitmapLayer(props, {
                            data: null,
                            image: props.data,
                            bounds: [west, south, east, north]
                        });
                    }
                });
            } else {
                layer = new MVTLayer({
                    ...common
                });
            }
        }

        onUpdate(layer);
    }, [
        name,
        JSON.stringify(style),
        dataResult && dataResult.state,
        preparedData,
    ]);

    return <></>;
};
