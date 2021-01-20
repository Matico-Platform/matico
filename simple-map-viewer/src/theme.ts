import { DefaultTheme, createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

export const Theme: DefaultTheme = {
  colors: {
    background: '#e1ecf2',
    main: '#24305E',
    secondary: '#F76C6C',
    bold: '#E85A4F',
    text: '#ffffff',
  },
  borderRadius: '10px',
};

export const GloablStyle = createGlobalStyle`
    ${reset}
    html {
        box-sizing: border-box;
    };
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
