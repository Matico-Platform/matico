import React from 'react';
import {
    Page,
    DetailsArea,
    FlexSeperator,
} from 'Components/Layout/Layout';
import { DashboardList } from 'Components/DashboardList/DashboardList';
import { Styles } from './DashboardsPageStyles';
import { NewDashboard } from 'Components/NewDashboard/NewDashboard';
import { useDashboards } from 'Hooks/useDashboards'

export const DashboardsPage: React.FC = () => {
    const {dashboards,loading, refreshDashboards, deleteDashboard} = useDashboards();

    return (
        <Page>
            <DetailsArea>
                <h1>Dashboards</h1>
                <FlexSeperator />
            </DetailsArea>
            <Styles.DashboardsPage>
                <DashboardList onDelete={dashboard_id =>deleteDashboard(dashboard_id)} dashboards={dashboards} loading={loading} />
                <NewDashboard onCreated={()=>refreshDashboards()}/>
            </Styles.DashboardsPage>
        </Page>
    );
};
