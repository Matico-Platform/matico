import React, { useState } from 'react';
import { useParams } from 'react-router';
import {
    useDataset,
    useDatasetPagedResults,
} from '../../Hooks/useDataset';
import { useData } from '../../Hooks/useData';
import { Styles } from './DatasetViewPageStyles';
import DeckGL from '@deck.gl/react';
import { MVTLayer } from '@deck.gl/geo-layers';
import { StaticMap } from 'react-map-gl';
import { DataTable } from '../../Components/DataTable/DataTable';
import { DataSetViewDetails } from '../../Components/DatasetViewDetails/DatasetViewDetails';
import { QueryPane } from '../../Components/QueryPane/QueryPane';

// import * as d3 from 'd3';

import {
    Page,
    PageContent,
    DetailsArea,
    FlexSeperator,
} from '../../Components/Layout/Layout';

const TOKEN = process.env.MAPBOX_TOKEN;

interface DatasetViewPageProps {}

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

const valueToTableEntry = (value: any) => {
    if (!value) {
        return 'Null';
    } else if (typeof value === 'object') {
        return value.type;
    } else {
        return value;
    }
};

const makeMvtLayer = (data: string | null, options = {}) => {
    if (data) {
        return new MVTLayer({
            data: data,
            // @ts-ignore
            getFillColor: [140, 170, 180, 90],
            getLineColor: [4, 4, 4],
            getBorderColor: [200, 200, 200],
            getLineWidth: 10,
            getRadius: 20,
            radiusMinPixels: 1,
            radiusMaxPixels: 100,
            getLabel: (f: any) => f.id,
            stroked: true,
            pickable: true,
            ...options,
        });
    }

    return null;
};

export const DatasetViewPage: React.FC<DatasetViewPageProps> = ({}) => {
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
    let { data, loading, error } = useData(dataQueryStrategy, {
        offset: page * perPage,
        limit: perPage,
    });

    // soon unnecessary
    if (data?.features)
        data = data.features.map((f: any) => f.properties);

    if (error) {
        return <h2>Error :-(</h2>;
    }

    if (loading || datasetLoading) {
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
                                    mapStyle={
                                        'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
                                    }
                                />
                            </DeckGL>
                        </Styles.Map>

                        <Styles.Details>
                            <DataSetViewDetails
                                onUpdate={updateSelectedFeature}
                                feature={selectedRow}
                            >
                                <QueryPane
                                    table={dataset.name}
                                    onQuery={setSQLQuery}
                                />
                            </DataSetViewDetails>
                        </Styles.Details>
                    </Styles.Content>
                )}
            </PageContent>
        </Page>
    );
};
