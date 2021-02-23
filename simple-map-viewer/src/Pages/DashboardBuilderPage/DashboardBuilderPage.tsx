import React from 'react';
import { Page, DetailsArea } from 'Components/Layout/Layout';
import { Styles } from './DashboardBuilderPageStyles';
import { useParams } from 'react-router';
import { DashboardViewer } from 'Components/DashboardViewer/DashboardViewer';
import { DashboardBuilderControlls } from 'Components/DashboardBuilderControlls/DashboardBuilderControlls';
import { DashboardBuilderProvider } from 'Contexts/DashbardBuilderContext';

interface ParamTypes {
    dashboard_id: string;
}

export const DashboardBuilderPage: React.FC = () => {
    const { dashboard_id } = useParams<ParamTypes>();
    const updateMapLoc = (update: any) => {
        console.log(update);
    };

    return (
        <DashboardBuilderProvider dashboard_id={dashboard_id}>
            <Page>
                <DetailsArea>
                    <DashboardBuilderControlls />
                </DetailsArea>
                <Styles.DashboardBuilderPage>
                    <DashboardViewer />
                </Styles.DashboardBuilderPage>
            </Page>
        </DashboardBuilderProvider>
    );
};
