import React from 'react';
import { List, Row } from '../List/List';
import { Button, ButtonType } from '../Button/Button';
import { Link } from 'react-router-dom';
import {Dataset} from 'api'

interface DatasetListProps{
    datasets: Dataset[],
    loading: boolean
}

export const DatasetList: React.FC<DatasetListProps> = ({datasets,loading}) => {

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
