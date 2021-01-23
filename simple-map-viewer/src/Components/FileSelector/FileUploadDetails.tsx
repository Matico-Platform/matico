import React, { useState } from 'react';
import { Uploader } from '../Uploader/Uploader';
import { Form } from '../Forms/Forms';
import { Styles } from './FileSelectorStyles';

interface FileUploadDetails {
    file: File;
}

export const FileUploadDetails: React.FC<FileUploadDetails> = ({
    file,
}) => {
    const [name, setName] = useState(file.name.split('.')[0]);
    const [description, setDescription] = useState('');
    const [startUpload, setStartUpload] = useState<boolean>(false);

    const upload = () => {
        setStartUpload(true);
    };

    const metadata = {
        name,
        description,
    };
    return (
        <div>
            {startUpload ? (
                <Uploader
                    url="/datasets"
                    file={file}
                    metadata={metadata}
                />
            ) : (
                <Form>
                    <h3>{file.name}</h3>
                    <label>name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                    />
                    <label>Description</label>
                    <input
                        type="textarea"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Description"
                    />
                    <label>Size</label>
                    <p>{(file.size * 1e-6).toPrecision(2)} Mb</p>
                    <button onClick={upload} type="submit">
                        Upload
                    </button>
                </Form>
            )}
        </div>
    );
};
