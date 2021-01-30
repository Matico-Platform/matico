import { DefaultTheme, createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

export const Theme: DefaultTheme = {
    colors: {
        background: '#85DCB',
        main: '#E27D60',
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
    };

    h1{
        font-size: 3rem;
    }
    h2{
        font-size: 2rem;
    }
    body{
        font-family: 'Nunito', sans-serif;
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
