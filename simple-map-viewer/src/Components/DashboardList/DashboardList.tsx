import React from 'react';
import { useDashboards } from '../../Hooks/useDashboards';
import { List, Row } from '../List/List';
import {Dashboard} from 'types'
import { Button, ButtonType } from '../Button/Button';
import { Link } from 'react-router-dom';

interface DashboardListProps  {
    dashboards: Dashboard[],
    loading: boolean,
    onDelete?: (dashboard_id: string) => void 
}
export const DashboardList: React.FC<DashboardListProps> = ({dashboards,loading, onDelete}) => {
   
    const deleteDashboard =(dashboard_id : string)=>{
        if(onDelete){
            onDelete(dashboard_id)
        }
    }

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
                            {onDelete && 
                                <Button onClick={()=>deleteDashboard(dashboard.id)} kind={ButtonType.Primary}>
                                    delete
                                </Button>
                            }
                    </div>
                </Row>
            ))}
        </List>
    );
};
