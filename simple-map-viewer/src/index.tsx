import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from 'styled-components';
import { Theme, GloablStyle } from './theme';
import { UserProvider } from './Contexts/UserContext';

ReactDOM.render(
    <React.StrictMode>
        <UserProvider>
            <ThemeProvider theme={Theme}>
                <GloablStyle />
                <App />
            </ThemeProvider>
        </UserProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
