import React from 'react';
import {
    Page,
    DetailsArea,
    FlexSeperator,
} from 'Components/Layout/Layout';
import { DashboardList } from 'Components/DashboardList/DashboardList';
import { Styles } from './DashboardsPageStyles';
import { NewDashboard } from 'Components/NewDashboard/NewDashboard';

export const DashboardsPage: React.FC = () => {
    return (
        <Page>
            <DetailsArea>
                <h1>Dashboards</h1>
                <FlexSeperator />
            </DetailsArea>
            <Styles.DashboardsPage>
                <DashboardList />
                <NewDashboard />
            </Styles.DashboardsPage>
        </Page>
    );
};
