import React, { useState, useEffect } from 'react';
import { Uploader } from '../Uploader/Uploader';
import { Card } from '../Card/Card';
import { uploadFile } from '../../api';
import { Tabs, Tab } from '../Tabs/Tabs';

type Props = {};

export const UploadForm: React.FC<Props> = ({}: Props) => {
    const [progress, setProgress] = useState(0);
    const [files, setFiles] = useState<FileList | null>(null);
    const [startUpload, setStartUpload] = useState<boolean>(false);

    const selectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        setFiles(e.target.files);
    };

    const upload = () => {
        setStartUpload(true);
    };

    return (
        <Card>
            <Tabs>
                <Tab name="Upload Files">
                    {files && (
                        <ul>
                            {Array.from(files).map((f) => (
                                <li>
                                    {startUpload ? (
                                        <Uploader
                                            key={f.name}
                                            url="/upload"
                                            file={f}
                                        />
                                    ) : (
                                        <>
                                            {f.name} :
                                            {(
                                                f.size * 1e-6
                                            ).toPrecision(2)}
                                            Mb
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    <input
                        onChange={selectFiles}
                        type="file"
                        multiple
                        name="file"
                    />
                    <button onClick={upload} type="submit">
                        Submit
                    </button>
                </Tab>
                <Tab name="Link Url">
                    <input type="text" name="url" placeholder="URL" />
                    <button type="submit">Link</button>
                </Tab>
            </Tabs>
        </Card>
    );
};
