import React, { useState } from 'react';
import { Form } from '../Forms/Forms';
import { createSyncDataset } from '../../api';

export const SyncDatasetForm: React.FC = () => {
    const [name, setName] = useState('');
    const [url, setURL] = useState('');
    const [description, setDescription] = useState('');
    const [refreshInterval, setRefreshInterval] = useState(60);

    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const clearForm = () => {
        setName('');
        setURL('');
        setDescription('');
        setRefreshInterval(60);
    };

    const createSync = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createSyncDataset({
            name,
            url,
            description,
            refreshInterval,
        })
            .then(() => {
                clearForm();
                setMessage('Successfully created synced dataset!');
            })
            .catch((e) => {
                setError(`Something went wrong :-( ${e.toString()}`);
            });
    };
    return (
        <Form onSubmit={createSync}>
            <label>Name</label>
            <input
                type="text"
                placeholder="URL"
                value={url}
                onChange={(e) => setURL(e.target.value)}
            />
            <label>URL</label>
            <input
                type="text"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <label>Description</label>
            <input
                type="text"
                placeholder="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <label>Refresh Interval</label>
            <input
                type="number"
                placeholder="refreshInterval"
                value={refreshInterval}
                onChange={(e) =>
                    setRefreshInterval(parseInt(e.target.value))
                }
            />
            <button type="submit">Start syncing</button>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </Form>
    );
};
