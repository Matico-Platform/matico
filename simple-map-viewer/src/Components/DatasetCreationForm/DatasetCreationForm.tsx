import React from 'react';
import { Card } from '../Card/Card';
import { Tabs, Tab } from '../Tabs/Tabs';
import { SyncDatasetForm } from '../SyncDatasetForm/SyncDatasetForm';
import { FileSelector } from '../FileSelector/FileSelector';

export const DatasetCreationForm: React.FC = () => {
    return (
        <Card>
            <Tabs>
                <Tab name="Upload Files">
                    <FileSelector />
                </Tab>
                <Tab name="Link Url">
                    <SyncDatasetForm />
                </Tab>
            </Tabs>
        </Card>
    );
};
