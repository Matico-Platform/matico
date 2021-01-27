import React from 'react';
import { DatasetCreationForm } from '../../Components/DatasetCreationForm/DatasetCreationForm';
import {DatasetList} from '../../Components/DatasetList/DatasetList'
import {Styles} from './DatasetsPageStyles'

interface DatasetPageProps {}

export const DatasetsPage: React.FC<DatasetPageProps> = ({}) => {
    return (
        <Styles.DatasetPage>
            <DatasetList/>
            <DatasetCreationForm />
        </Styles.DatasetPage>
    );
};
