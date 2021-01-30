import React from 'react';
import { DatasetCreationForm } from '../../Components/DatasetCreationForm/DatasetCreationForm';
import { DatasetList } from '../../Components/DatasetList/DatasetList';
import { Styles } from './DatasetsPageStyles';
import {
    Page,
    PageContent,
    DetailsArea,
} from '../../Components/Layout/Layout';

interface DatasetPageProps {}

export const DatasetsPage: React.FC<DatasetPageProps> = ({}) => {
    return (
        <Page>
            <PageContent>
                <DatasetList />
                <DatasetCreationForm />
            </PageContent>
        </Page>
    );
};
