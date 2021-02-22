import React, { useState } from 'react';
import { Uploader } from '../Uploader/Uploader';
import { Form } from '../Forms/Forms';
import { Styles } from './FileSelectorStyles';

interface FileUploadDetailsProps {
    file: File;
}

export const FileUploadDetails: React.FC<FileUploadDetailsProps> = ({
    file,
}) => {
    const [name, setName] = useState(file.name.split('.')[0]);
    const [description, setDescription] = useState('');
    const [idCol, setIdCol] = useState('id');
    const [geomCol, setGeomCol] = useState('wkb_geometry');
    const [startUpload, setStartUpload] = useState<boolean>(false);

    const upload = () => {
        setStartUpload(true);
    };

    const metadata = {
        name,
        description,
        id_col: idCol,
        geom_col: geomCol,
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
                    <label>Id Column</label>
                    <input
                        type="textarea"
                        value={idCol}
                        onChange={(e) => setIdCol(e.target.value)}
                        placeholder="Id column"
                    />
                    <label>Geom Column</label>
                    <input
                        type="textarea"
                        value={geomCol}
                        onChange={(e) => setGeomCol(e.target.value)}
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
