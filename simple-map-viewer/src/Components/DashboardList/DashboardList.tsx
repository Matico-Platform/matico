import React from 'react';
import { useDashboards } from '../../Hooks/useDashboards';
import { List, Row } from '../List/List';

import { Button, ButtonType } from '../Button/Button';
import { Link } from 'react-router-dom';

export const DashboardList: React.FC = () => {
    const { dashboards, loading } = useDashboards();

    return (
        <List loading={loading}>
            {dashboards.map((dashboard) => (
                <Row key={dashboard.name}>
                    <div>
                        <h3>{dashboard.name}</h3>
                        <p>{dashboard.description}</p>
                    </div>
                    <div>
                        <Link to={`/dashboard/${dashboard.id}`}>
                            <Button kind={ButtonType.Secondary}>
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
