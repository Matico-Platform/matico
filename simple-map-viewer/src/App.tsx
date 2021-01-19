import React from 'react';
import logo from './logo.svg';
import {LoginSignup} from './components/LoginSignup/LoginSignup'
import {UploadForm} from './components/UploadForm/UploadForm'
import {useProfile} from './hooks/useProfile'
import {AppLayout, NavArea, DetailsArea,MainArea} from './components/Layout/Layout'
import {NavBar, NavBarButton, NavBarSpacer} from './components/NavBar/NavBar'
import {BrowserRouter as Router, Switch, Route, NavLink} from 'react-router-dom'
import {useAuth0} from "@auth0/auth0-react"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {HomePage} from './components/HomePage/HomePage'

import {Dashboard} from './components/Dashboard/Dashboard'

import {faMap, faUpload, faUser, faInfo} from '@fortawesome/free-solid-svg-icons'

import './App.css';

function App() {
  const {logout, loginWithRedirect, user,isAuthenticated, isLoading} = useAuth0();
  const profile = useProfile();

  return (
      <Router>
      <AppLayout>
        <NavArea>
          <NavBar>
              <NavBarButton>
            <NavLink to='/dashboard'> 
                <FontAwesomeIcon icon={faMap}/>
            </NavLink>
              </NavBarButton>
              <NavBarButton>
            <NavLink  to='/upload'> 
                <FontAwesomeIcon icon={faUpload}/>
            </NavLink>
              </NavBarButton>
              <NavBarSpacer />
              <NavBarButton> 
                <NavLink to='/info'> 
                    <FontAwesomeIcon icon={faInfo}/>
                </NavLink>
              </NavBarButton>
              <NavBarButton> 
            <NavLink to='/login'> 
                <FontAwesomeIcon icon={faUser}/>
            </NavLink>
              </NavBarButton>
          </NavBar>
          </NavArea>
        <DetailsArea />
        <MainArea>
            <Switch>
              <Route exact={true} path='/'>
                <HomePage />
              </Route>
              <Route exact={true} path='/login'>
                <LoginSignup/>
              </Route>
              <Route exact={true} path='/upload'>
                <UploadForm/>
              </Route>
              <Route exact={true} path='/info'>
                <h1>Info</h1>
              </Route>
              <Route exact={true} path='/dashboard'>
                <Dashboard />
              </Route>
            </Switch>
        </MainArea>
      </AppLayout>
    </Router>
  );
}

export default App;
