import React from 'react';
import { useDashboards} from '../../Hooks/useDashboards';
import { Styles } from './DashboardListStyles';
import {List,Row} from '../List/List'

import { Button, ButtonType } from '../Button/Button';
import { Link } from 'react-router-dom';

interface DashboardListProps{}

export const DashboardList: React.FC<DashboardListProps> = ({}) => {
    const { dashboards, loading } = useDashboards();

    return (
        <List loading ={loading}>
            {dashboards.map((dashboard) => (
                <Row>
                    <div>
                        <h3>{dashboard.name}</h3>
                        <p>{dashboard.description}</p>
                    </div>
                    <div>
                        <Link to={`/dashboard/${dashboard.id}`}>
                            <Button
                                kind={ButtonType.Secondary}
                            >
                                view
                            </Button>
                        </Link>

                        <Link to={`/datasets/${dashboard.id}`}>
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
