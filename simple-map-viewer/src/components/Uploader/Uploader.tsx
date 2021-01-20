import React, { useEffect, useState } from 'react';
import { uploadFile } from '../../api';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { Styles } from './UploaderStyles';

type Props = {
    file: File;
    url: string;
    onDone?: () => void;
    onFail?: (e: Error) => void;
};

enum UploadState {
    PENDING,
    IN_PROGRESS,
    DONE,
    FAILED,
}
export const Uploader: React.FC<Props> = ({
    file,
    url,
    onDone,
    onFail,
}) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [state, setState] = useState<UploadState>(
        UploadState.PENDING,
    );
    useEffect(() => {
        uploadFile(file, url, setProgress)
            .then(() => setState(UploadState.DONE))
            .catch((error: any) => {
                setError(error);
                setState(UploadState.FAILED);
            });
    }, []);
    return (
        <Styles.UploaderOuter>
            <Styles.UploaderFilename>
                {file.name}
            </Styles.UploaderFilename>
            <ProgressBar progress={progress} showPC={true} />
        </Styles.UploaderOuter>
    );
};
