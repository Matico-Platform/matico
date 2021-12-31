import React from 'react';
import { Card } from '../Card/Card';
import { Tabs, Tab } from '../Tabs/Tabs';
import { SyncDatasetForm } from '../SyncDatasetForm/SyncDatasetForm';
import { FileSelector } from '../FileSelector/FileSelector';

interface DatasetCreationFormProps{
    onCreated: ()=>void
}
export const DatasetCreationForm: React.FC<DatasetCreationFormProps> = ({onCreated}) => {
    return (
        <Card>
            <Tabs>
                <Tab name="Upload Files">
                    <FileSelector onDone={onCreated} />
                </Tab>
                <Tab name="Link Url">
                    <SyncDatasetForm />
                </Tab>
            </Tabs>
        </Card>
    );
};
