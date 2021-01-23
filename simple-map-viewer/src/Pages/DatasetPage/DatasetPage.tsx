import React from 'react';
import { DatasetCreationForm } from '../../Components/DatasetCreationForm/DatasetCreationForm';

interface DatasetPageProps {}

export const DatasetPage: React.FC<DatasetPageProps> = ({}) => {
    return (
        <div>
            <DatasetCreationForm />
        </div>
    );
};
