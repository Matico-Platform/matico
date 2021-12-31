import React, { useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useDataset } from 'Hooks/useDataset';
import { useDataSource } from 'Hooks/useDataSource';
import { Styles } from './DatasetViewPageStyles';
import DeckGL from '@deck.gl/react';
import { MVTLayer } from '@deck.gl/geo-layers';
import { StaticMap } from 'react-map-gl';
import { DataTable } from 'Components/DataTable/DataTable';
import { QueryPane } from 'Components/QueryPane/QueryPane';
import { Tabs, Tab } from 'Components/Tabs/Tabs';
import { FeatureEditor } from 'Components/FeatureEditor/FeatureEditor';
import { Pagination } from 'Components/Pagination/Pagination';

// import * as d3 from 'd3';

import {
    Page,
    PageContent,
    DetailsArea,
    FlexSeperator,
} from 'Components/Layout/Layout';
import { HoverToolTip } from 'Components/HoverToolTip/HoverToolTip';

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
            getLineColor: [255, 0, 0, 255],
            getLineWidth: 1,
            lineWidthUnits: 'pixels',
            getFillColor: [226, 125, 96, 200],
            getBorderColor: [200, 200, 200],
            getRadius: 40,
            stroked: true,
            pickable: true,
            autoHighlight: true,
            highlightColor: [200, 100, 200, 200],
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
    const [selectedTab, setSelectedTab] = useState<any>('Query');
    const [hoverInfo, setHoverInfo] = useState<any>(null);
    const perPage = 100;

    console.log('Hover info ', hoverInfo);

    const {
        dataset,
        loading: datasetLoading,
        error: datasetError,
    } = useDataset(id);

    const dataQueryStrategy = sqlString
        ? { sql: sqlString }
        : { datasetId: id };

    const {
        data,
        loading: dataLoading,
        error,
        pages,
        page,
        setPage,
    } = useDataSource(dataQueryStrategy, { perPage });

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

    const selectFeature = (feature: any) => {
        setSelectedRow(feature);
        setSelectedTab('Feature');
    };
    const mapClicked = (info: any, event: any) => {
        console.log('MAP CLICK ', info, event);
        selectFeature(info.object.properties);
    };

    return (
        <Page>
            <DetailsArea>
                <h2>{datasetLoading ? id : dataset?.name}</h2>
                <p>{dataset?.description}</p>

                <p>Id column :{dataset?.id_col} </p>
                <p>Geom column : {dataset?.geom_col}</p>

                <FlexSeperator />
                <p>Created at: {dataset?.created_at}</p>
                <p>Updated at: {dataset?.updated_at}</p>
            </DetailsArea>
            <PageContent>
                {dataset && (
                    <Styles.Content>
                        <Styles.Table>
                            {dataLoading ? (
                                <h3>Loading</h3>
                            ) : (
                                <DataTable
                                    data={data}
                                    selectedID={
                                        selectedRow
                                            ? selectedRow[
                                                  dataset.id_col
                                              ]
                                            : null
                                    }
                                    onSelect={selectFeature}
                                    idCol={dataset.id_col}
                                />
                            )}

                            {pages && (
                                <Styles.TablePagination>
                                    <Pagination
                                        pages={pages!}
                                        page={page}
                                        onPageChange={(page) =>
                                            setPage(page)
                                        }
                                    />
                                </Styles.TablePagination>
                            )}
                        </Styles.Table>
                        <Styles.Map>
                            <DeckGL
                                width={'100%'}
                                height={'100%'}
                                initialViewState={INITIAL_VIEW_STATE}
                                layers={layer ? [layer] : ([] as any)}
                                controller={true}
                                onClick={mapClicked}
                                onHover={(info: any) => {
                                    setHoverInfo(info);
                                }}
                            >
                                <StaticMap
                                    mapboxApiAccessToken={TOKEN}
                                    width={'100%'}
                                    height={'100%'}
                                    mapStyle="mapbox://styles/mapbox/dark-v10"
                                />
                                {hoverInfo && hoverInfo.object && (
                                    <HoverToolTip
                                        x={hoverInfo.x}
                                        y={hoverInfo.y}
                                        info={
                                            hoverInfo.object
                                                .properties
                                        }
                                    />
                                )}
                            </DeckGL>
                        </Styles.Map>

                        <Styles.Details>
                            <Tabs
                                onTabSelected={setSelectedTab}
                                activeTab={selectedTab}
                            >
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
