import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useDataset } from 'Hooks/useDataset';
import { useData } from 'Hooks/useData';
import { Styles } from './DatasetViewPageStyles';
import DeckGL from '@deck.gl/react';
import { MVTLayer } from '@deck.gl/geo-layers';
import { StaticMap } from 'react-map-gl';
import { DataTable } from 'Components/DataTable/DataTable';
import { QueryPane } from 'Components/QueryPane/QueryPane';
import { Tabs, Tab } from 'Components/Tabs/Tabs';
import { FeatureEditor } from 'Components/FeatureEditor/FeatureEditor';

// import * as d3 from 'd3';

import {
    Page,
    PageContent,
    DetailsArea,
    FlexSeperator,
} from 'Components/Layout/Layout';

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

interface ParamTypes {
    id: string;
}

const INITIAL_VIEW_STATE = {
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 10,
    pitch: 0,
    bearing: 0,
};

const makeMvtLayer = (data: string | null, options = {}) => {
    if (data) {
        return new MVTLayer({
            data: data,
            // @ts-ignore
            getFillColor: [226, 125, 96, 200],
            getLineColor: [4, 4, 4],
            getBorderColor: [200, 200, 200],
            getLineWidth: 10,
            getRadius: 40,
            stroked: true,
            pickable: true,
            autoHighlight: true,
            radiusUnits: 'pixels',
            ...options,
        });
    }

    return null;
};

export const DatasetViewPage: React.FC = () => {
    // DatasetViewPage-specific concerns
    const { id } = useParams<ParamTypes>();
    const [sqlString, setSQLQuery] = useState<any>(null); // this should go into useDataset
    const [selectedRow, setSelectedRow] = useState<any>(null); // this should go into useDataset
    const [page, setPage] = useState(0);
    const perPage = 100;

    const {
        dataset,
        loading: datasetLoading,
        error: datasetError,
    } = useDataset(id);

    const dataQueryStrategy = sqlString
        ? { sql: sqlString }
        : { datasetId: id };

    const { data, loading, error } = useData(dataQueryStrategy, {
        offset: page * perPage,
        limit: perPage,
    });

    if (datasetLoading) {
        return <div>LOADING...</div>;
    }

    const dataLayerEndpoint = sqlString
        ? `${window.origin}/api/tiler/{z}/{x}/{y}?q=${sqlString}`
        : `${window.origin}/api/tiler/dataset/${id}/{z}/{x}/{y}`;
    const layer = makeMvtLayer(dataLayerEndpoint);

    //TODO implement this
    const updateSelectedFeature = (update: any) => {
        // updateFeature(id, update)
    };

    return (
        <Page>
            <DetailsArea>
                <h2>{loading ? id : dataset?.name}</h2>
                <p>{dataset?.description}</p>

                <p>Id column :{dataset?.id_col} </p>
                <p>Geom column : {dataset?.geom_col}</p>

                <FlexSeperator />
                <p>Created at: {dataset?.created_at}</p>
                <p>Updated at: {dataset?.updated_at}</p>
            </DetailsArea>
            <PageContent>
                {dataset && data && (
                    <Styles.Content>
                        <Styles.Table>
                            <DataTable
                                data={data}
                                selectedID={selectedRow?.id}
                                onSelect={setSelectedRow}
                            />
                        </Styles.Table>
                        <Styles.Map>
                            <DeckGL
                                width={'100%'}
                                height={'100%'}
                                initialViewState={INITIAL_VIEW_STATE}
                                layers={layer ? [layer] : ([] as any)}
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
                                    mapStyle='mapbox://styles/mapbox/dark-v10'
                                />
                            </DeckGL>
                        </Styles.Map>

                        <Styles.Details>
                            <Tabs>
                                <Tab name="Query">
                                    <QueryPane
                                        table={dataset.name}
                                        onQuery={setSQLQuery}
                                        error={error}
                                    />
                                </Tab>
                                <Tab name="Feature">
                                    <FeatureEditor
                                        feature={selectedRow}
                                        onSave={updateSelectedFeature}
                                        editable={true}
                                    />
                                </Tab>
                            </Tabs>
                        </Styles.Details>
                    </Styles.Content>
                )}
            </PageContent>
        </Page>
    );
};
