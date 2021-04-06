import React from 'react';
import { Styles } from './DashboardViewerStyles';
import { BaseMap, Layer } from 'api';
import DeckGL from '@deck.gl/react';
import { MVTLayer } from '@deck.gl/geo-layers';
import { StaticMap } from 'react-map-gl';
import { useDashboard } from 'Contexts/DashbardBuilderContext';
import { ColorSpecification } from 'api';
import { LayerControlls } from 'Components/LayerControls/dist/LayerControlls';

function lookupBaseMapURL(basemap: BaseMap | undefined) {
    switch (basemap) {
        case BaseMap.CartoDBPositron:
            return 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
        case BaseMap.CartoDBVoyager:
            return 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
        case BaseMap.CartoDBDarkMatter:
            return 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
        case BaseMap.Light:
            return 'mapbox://styles/mapbox/light-v10';
        case BaseMap.Dark:
            return 'mapbox://styles/mapbox/dark-v10';
        case BaseMap.Satelite:
            return 'mapbox://styles/mapbox/satellite-v9';
        case BaseMap.Terrain:
            return 'mapbox://styles/mapbox/outdoors-v11';
        case BaseMap.Streets:
            return 'mapbox://styles/mapbox/streets-v11';
        default:
            return 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
    }
}

function colorSpecificationToGLSpec(color: ColorSpecification) {
    if (color.single_color) {
        return color.single_color.color;
    } else if (color.category_color) {
        const spec = color.category_color;
        const colorSelector = (f: any) => {
            const cat = `${f.properties[spec.column]}`;
            const index = spec.categories.findIndex((c) => c === cat);
            if (index >= 0) {
                return spec.colors[index];
            } else {
                return spec.colors[spec.colors.length - 1];
            }
        };
        return colorSelector;
    }
}

function constructLayer(layer: Layer) {
    const source = layer.source;
    const source_id = Object.values(source)[0];
    const styleType = Object.keys(layer.style)[0]!;

    let style = {};
    switch (styleType) {
        case 'Polygon':
            style = {
                getFillColor: colorSpecificationToGLSpec(
                    layer.style.Polygon!.fill,
                ),
                getLineColor: colorSpecificationToGLSpec(
                    layer.style.Polygon!.stroke,
                ),
                updateTriggers: {
                    getFillColor: [layer.style.Polygon!.fill],
                    getLineColor: [layer.style.Polygon!.stroke],
                },
                lineWidthUnits: layer.style.Polygon!.stroke_units,
                stroked: true,
                getLineWidth: layer.style.Polygon!.stroke_width,
                pickable: true,
            };
            break;
        case 'Point':
            console.log('size units ', layer.style.Point!.size_units);
            style = {
                getFillColor: colorSpecificationToGLSpec(
                    layer.style.Point!.fill,
                ),
                getLineColor: colorSpecificationToGLSpec(
                    layer.style.Point!.stroke,
                ),
                getLineWidth: layer.style.Point!.stroke_width,
                getRadius: layer.style.Point!.size,
                pickable: true,
                radiusUnits: layer.style.Point!.size_units,
                lineWidthUnits: layer.style.Point!.stroke_units,
                updateTriggers: {
                    getFillColor: [layer.style.Point!.fill],
                    getBorderColor: [layer.style.Point!.stroke],
                },
            };
            break;
        case 'Line':
            style = {
                getLineColor: colorSpecificationToGLSpec(
                    layer.style.Line!.stroke,
                ),
                getLineWidth: layer.style.Line!.stroke_width,
                lineWidthUnits: 'pixels',
                updateTriggers: {
                    getLineColor: [layer.style.Line!.stroke],
                },
                pickable: true,
            };
            break;
    }

    return new MVTLayer({
        id: layer.name,
        data: `${window.origin}/api/tiler/dataset/${source_id}/{z}/{x}/{y}`,
        ...style,
    });
}
const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export const DashboardViewer: React.FC = () => {
    const { dashboard } = useDashboard();

    const INITIAL_VIEW_STATE = {
        longitude: -74.006,
        latitude: 40.7128,
        zoom: 10,
        pitch: 0,
        bearing: 0,
    };

    const mapStyle = dashboard?.map_style;
    const layers: any = mapStyle
        ? mapStyle.layers.map(constructLayer)
        : [];

    const baseMap = lookupBaseMapURL(mapStyle?.base_map);
    console.log('Base map ', baseMap);

    return (
        <Styles.DashboardOuter>
            <DeckGL
                width={'100%'}
                height={'100%'}
                initialViewState={INITIAL_VIEW_STATE}
                layers={layers}
                controller={true}
                getTooltip={({ object }: any) => {
                    console.log('tool tip ', object);
                    return object && object.message;
                }}
            >
                <StaticMap
                    mapboxApiAccessToken={TOKEN}
                    width={'100%'}
                    height={'100%'}
                    mapStyle={baseMap}
                />
            </DeckGL>
        </Styles.DashboardOuter>
    );
};
