import React from 'react';
import { Styles } from './DashboardViewerStyles';
import { BaseMap, Layer } from 'api';
import DeckGL from '@deck.gl/react';
import { MVTLayer } from '@deck.gl/geo-layers';
import { StaticMap } from 'react-map-gl';
import { useDashboard } from 'Contexts/DashbardBuilderContext';

function lookupBaseMapURL(basemap: BaseMap | undefined) {
    switch (basemap) {
        case BaseMap.CartoDBPositron:
            return 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
        case BaseMap.CartoDBVoyager:
            return 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
        case BaseMap.CartoDBDarkMatter:
            return 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
        case BaseMap.Light:
            return "mapbox://styles/mapbox/light-v10";
        case BaseMap.Dark:
            return  "mapbox://styles/mapbox/dark-v10";
        case BaseMap.Satelite:
            return "mapbox://styles/mapbox/satellite-v9"
        case BaseMap.Terrain:
            return "mapbox://styles/mapbox/outdoors-v11";
        case BaseMap.Streets:
            return "mapbox://styles/mapbox/streets-v11";
        default:
            return 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
    }
}

function constructLayer(layer: Layer) {
    const source = layer.source;
    const source_id = Object.values(source)[0];
    const styleType = Object.keys(layer.style)[0];
    const styleSpec = Object.values(layer.style)[0];

    let style = {};
    switch (styleType) {
        case 'Polygon':
            style = {
                getFillColor: styleSpec.fill,
                getBorderColor: styleSpec.stroke,
                stroked: true,
                getLineWidth: styleSpec.stroke_width,
                pickable: true,
            };
            break;
        case 'Point':
            style = {
                getFillColor: styleSpec.fill,
                getBorderColor: styleSpec.stroke,
                getRadius: styleSpec.size,
                pickable: true,
            };
            break;
    }

    console.log('Layer name is ', layer.name);

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
    console.log("Base map ", baseMap);

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
