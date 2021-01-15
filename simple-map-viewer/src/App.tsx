import React from 'react';
import logo from './logo.svg';
import {LoginSignup} from './components/LoginSignup/LoginSignup'
import {UploadForm} from './components/UploadForm/UploadForm'

import {useAuth0} from "@auth0/auth0-react"

import './App.css';

function App() {
  const {logout, loginWithRedirect, user,isAuthenticated, isLoading} = useAuth0();
  console.log(user)

  return (
    <div className="App">
      <main>
          <LoginSignup/>
          <UploadForm/>
      </main>
    </div>
  );
}

export default App;
