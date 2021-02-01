import { DefaultTheme, createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

export const Theme: DefaultTheme = {
    colors: {
        background: '#eef8f7',
        main: '#E27D60',
        secondaryLight: '#b4e3dd',
        secondary: '#41B3A3',
        bold: '#E85A4F',
        text: '#ffffff',
    },
    borderRadius: '10px',
};

export const GloablStyle = createGlobalStyle`
    ${reset}
    html {
        box-sizing: border-box;
        font-size: 100%;
        width:100vw;
        height:100vh;
    };

    h1{
        font-size: 3rem;
    }
    h2{
        font-size: 2rem;
    }
    #root{
        width:100vw;
        height:100vh;
    }
    body{
        font-family: 'Nunito', sans-serif;
        width:100vw;
        height:100vh;
    }
    h1,h2,h3,h4,h5,h6{
        font-family: 'Open Sans', sans-serif;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    };
    input{
        padding:10px 20px;
        box-shadow:none;
    }
`;
