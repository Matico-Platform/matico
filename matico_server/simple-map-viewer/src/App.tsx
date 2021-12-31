import React from 'react';
import { LoginSignupPage } from 'Pages/LoginSignupPage/LoginSignupPage';
import { DatasetsPage } from 'Pages/DatasetsPage/DatasetsPage';
import { DashboardsPage } from 'Pages/DashboardsPage/DashboardsPage';
import { DatasetViewPage } from 'Pages/DatasetViewPage/DatasetViewPage';
import { DashboardBuilderPage } from 'Pages/DashboardBuilderPage/DashboardBuilderPage';
import { ModalContainer } from 'react-router-modal';
import { useUser } from 'Contexts/UserContext';
import { ProfilePage } from 'Pages/ProfilePage/ProfilePage';
import { Playground } from 'Pages/Playground/Playground';
import { AppLayout, NavArea } from './Components/Layout/Layout';
import {
    NavBar,
    NavBarButton,
    NavBarSpacer,
} from './Components/NavBar/NavBar';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
} from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HomePage } from './Pages/HomePage/HomePage/HomePage';

import {
    faMap,
    faUser,
    faInfo,
    faDatabase,
} from '@fortawesome/free-solid-svg-icons';

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import 'react-router-modal/css/react-router-modal.css';

export const App: React.FC = () => {
    const { user } = useUser();
    return (
        <Router>
            <AppLayout>
                <NavArea>
                    <NavBar>
                        <NavBarButton>
                            <NavLink to="/dashboards">
                                <FontAwesomeIcon icon={faMap} />
                            </NavLink>
                        </NavBarButton>
                        <NavBarButton>
                            <NavLink to="/datasets">
                                <FontAwesomeIcon icon={faDatabase} />
                            </NavLink>
                        </NavBarButton>
                        <NavBarSpacer />
                        <NavBarButton>
                            <NavLink to="/info">
                                <FontAwesomeIcon icon={faInfo} />
                            </NavLink>
                        </NavBarButton>
                        {user ? (
                            <NavBarButton>
                                <NavLink to="/profile">
                                    <FontAwesomeIcon icon={faUser} />
                                    <p>{user.username}</p>
                                </NavLink>
                            </NavBarButton>
                        ) : (
                            <NavBarButton>
                                <NavLink to="/login">
                                    <FontAwesomeIcon icon={faUser} />
                                </NavLink>
                            </NavBarButton>
                        )}
                    </NavBar>
                </NavArea>
                <Switch>
                    <Route exact={true} path="/">
                        <HomePage />
                    </Route>
                    <Route exact={true} path="/login">
                        <LoginSignupPage />
                    </Route>
                    <Route exact={true} path="/profile">
                        <ProfilePage />
                    </Route>
                    <Route exact={true} path="/datasets">
                        <DatasetsPage />
                    </Route>
                    <Route exact={true} path="/dashboards">
                        <DashboardsPage />
                    </Route>
                    <Route exact={true} path="/playground">
                        <Playground />
                    </Route>
                    <Route
                        exact={true}
                        path="/datasets/:id"
                        component={DatasetViewPage}
                    />
                    <Route
                        exact={false}
                        path="/dashboard/:dashboard_id"
                        component={DashboardBuilderPage}
                    />
                    <Route exact={true} path="/info">
                        <h1>Info</h1>
                    </Route>
                </Switch>
            </AppLayout>
            <ModalContainer />
        </Router>
    );
};

export default App;
