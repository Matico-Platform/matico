import styled from 'styled-components'

const LayerControlls= styled.div`
    h3{
        font-size:20px;
        /* text-decoration:underline; */
        font-weight:bold;
        margin-bottom:10px;
    }
    padding: 10px 0px;
    section{
        padding:10px 0px 0px 5px;
    }
`

interface ColorBarProps{
    c: {r:number, g:number, b:number, a:number}
}
const ColorBar = styled.div<ColorBarProps>`
    border:2px solid white;
    background-color: ${ ({c}) => `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`};
    height:15px;
    cursor:pointer;
`

export const Styles={
    LayerControlls,
    ColorBar
}