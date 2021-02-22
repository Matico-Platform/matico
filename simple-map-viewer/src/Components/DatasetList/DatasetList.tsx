import React from 'react';
import { useDatasets } from '../../Hooks/useDatasets';
import { Styles } from './DatasetListStyles';
import { List, Row } from '../List/List';

import { Button, ButtonType } from '../Button/Button';
import { Link } from 'react-router-dom';

export const DatasetList: React.FC = () => {
    const { datasets, loading } = useDatasets();

    return (
        <List loading={loading}>
            {datasets.map((dataset) => (
                <Row key={dataset.name}>
                    <div>
                        <h3>{dataset.name}</h3>
                        <p>{dataset.description}</p>
                    </div>
                    <div>
                        <Link to={`/datasets/${dataset.id}`}>
                            <Button kind={ButtonType.Secondary}>
                                view
                            </Button>
                        </Link>

                        <Link to={`/datasets/${dataset.id}`}>
                            <Button kind={ButtonType.Primary}>
                                delete
                            </Button>
                        </Link>
                    </div>
                </Row>
            ))}
        </List>
    );
};
