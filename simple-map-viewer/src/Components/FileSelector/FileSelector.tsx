import React, { useState } from 'react';
import { FileUploadDetails } from './FileUploadDetails';

export const FileSelector: React.FC = () => {
    const [files, setFiles] = useState<FileList | null>(null);

    const selectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        setFiles(e.target.files);
    };
    return (
        <div>
            {files && (
                <ul>
                    {Array.from(files).map((file, index) => (
                        <FileUploadDetails key={index} file={file} />
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
