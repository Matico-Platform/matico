import React from 'react';
import { DatasetCreationForm } from 'Components/DatasetCreationForm/DatasetCreationForm';
import { DatasetList } from 'Components/DatasetList/DatasetList';
import { Styles } from './DatasetsPageStyles';
import { FlexSeperator } from 'Components/Layout/Layout';
import { Button, ButtonType } from 'Components/Button/Button';
import {useDatasets} from 'Hooks/useDatasets'

import { Page, DetailsArea } from 'Components/Layout/Layout';

export const DatasetsPage: React.FC = () => {
    const {datasets,loading, refreshDatasets} = useDatasets()

    return (
        <Page>
            <DetailsArea>
                <h1>Datasets</h1>
                <FlexSeperator />
                <Button kind={ButtonType.Primary}>
                    Add Datasets
                </Button>
            </DetailsArea>
            <Styles.DatasetsPage>
                <DatasetList datasets={datasets} loading={loading}/>
                <DatasetCreationForm onCreated={()=>refreshDatasets()} />
            </Styles.DatasetsPage>
        </Page>
    );
};
