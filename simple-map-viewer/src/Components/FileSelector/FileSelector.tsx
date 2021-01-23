import React, { useState } from 'react';
import { FileUploadDetails } from './FileUploadDetails';
import { Styles } from './FileSelectorStyles';

interface FileSelectorProps {}

export const FileSelector: React.FC<FileSelectorProps> = ({}) => {
    const [files, setFiles] = useState<FileList | null>(null);

    const selectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        setFiles(e.target.files);
    };
    return (
        <div>
            {files && (
                <ul>
                    {Array.from(files).map((file) => (
                        <FileUploadDetails file={file} />
                    ))}
                </ul>
            )}
            <input
                onChange={selectFiles}
                type="file"
                multiple
                name="file"
            />
        </div>
    );
};
