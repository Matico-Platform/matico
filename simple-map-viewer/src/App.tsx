import React from 'react';
import logo from './logo.svg';
import {useAuth0} from "@auth0/auth0-react"

import './App.css';

function App() {
  const {logout, loginWithRedirect, user,isAuthenticated, isLoading} = useAuth0();
  console.log(user)

  return (
    <div className="App">
      <header className="App-header">
        {isLoading && 
        <p>loading...</p>}
        {isAuthenticated &&
        <div className='profile'>
          <h1>{user.nickname}</h1>
          <p>{user.email}</p>
          <img src={user.picture}/>
        </div>
        }
        
        {user ? 
          <button onClick={()=>logout()}>Logout</button>:
          <button onClick={()=>loginWithRedirect()}>Login</button>
        }
      </header>
      <main>
            <form target="http://localhost:8080/upload" method="post" enctype="multipart/form-data">
            <input type="file" multiple name="file" />
            <button type="submit">Submit</button>
            </form>
        </main>
    </div>
  );
}

export default App;
