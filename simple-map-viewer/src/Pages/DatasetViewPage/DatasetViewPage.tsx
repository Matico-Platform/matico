import React from 'react';
import { useParams } from 'react-router';
import {
    useDataset,
    useDatasetPagedResults,
} from '../../Hooks/useDataset';
import { Styles } from './DatasetViewPageStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import DeckGL from '@deck.gl/react';
import { MVTLayer } from '@deck.gl/geo-layers';
import { StaticMap } from 'react-map-gl';
import { DataTable } from '../../Components/DataTable/DataTable';
// import * as d3 from 'd3';

import {
    Page,
    PageContent,
    DetailsArea,
} from '../../Components/Layout/Layout';

const TOKEN =
    'pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw';

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

export const DatasetViewPage: React.FC<DatasetViewPageProps> = ({}) => {
    const { id } = useParams<ParamTypes>();
    const { dataset, loading, error } = useDataset(id);

    const layer = dataset
        ? new MVTLayer({
              data: `${window.origin}/api/tiler/${dataset.id}/{z}/{x}/{y}`,
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
          })
        : null;

    return (
        <Page>
            <DetailsArea>
                <h2>{loading ? id : dataset?.name}</h2>
                <p>{dataset?.description}</p>
            </DetailsArea>
            <PageContent>
                {dataset && (
                    <Styles.Content>
                        <Styles.Table>
                            <DataTable dataset={dataset} />
                        </Styles.Table>
                        <Styles.Map>
                            <DeckGL
                                width={'100%'}
                                height={'100%'}
                                initialViewState={INITIAL_VIEW_STATE}
                                layers={layer ? [layer] : ([] as any)}
                                controller={true}
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
                    </Styles.Content>
                )}
            </PageContent>
        </Page>
    );
};
