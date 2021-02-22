import React, { useState, useEffect } from 'react';
import { Uploader } from '../Uploader/Uploader';
import { Card } from '../Card/Card';
import { Tabs, Tab } from '../Tabs/Tabs';
import { SyncDatasetForm } from '../SyncDatasetForm/SyncDatasetForm';
import { FileSelector } from '../FileSelector/FileSelector';

export const DatasetCreationForm: React.FC = () => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [startUpload, setStartUpload] = useState<boolean>(false);

    const selectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        setFiles(e.target.files);
    };
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
