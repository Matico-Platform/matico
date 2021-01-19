import {DefaultTheme, createGlobalStyle} from 'styled-components'
import reset from 'styled-reset'

export const Theme: DefaultTheme={
    colors:{
        background: '#A8D0E6',
        main: '#24305E',
        secondary: '#F76C6C',
        bold: '#E85A4F',
        text: '#ffffff',
    },
    borderRadius: '10px'
}

export const GloablStyle = createGlobalStyle`
    ${reset}
    html {
        box-sizing: border-box;
    };
    *, *:before, *:after {
        box-sizing: inherit;
    };
`