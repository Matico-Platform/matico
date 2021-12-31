import styled from 'styled-components'

interface HoverProps{
    x: number,
    y: number,
    theme:any
}

const HoverToolTip = styled.div<HoverProps>`
    position: absolute;
    top: ${({y})=> y}px;
    left: ${(({x})=>x)}px;
    background-color: ${({theme})=> theme.colors.secondary} ;
    padding:20px;
    color:white;
    z-index:10;    
    transform:translate(-50%, 0 );
`

const PropertiesTable = styled.table`
    width:100%;
`

const PropertyName = styled.td`
    text-align: left;
    font-weight: 700;
`

const PropertyVal= styled.td`
    text-align:right;

`
const Property = styled.tr`

`

export const Styles ={
    HoverToolTip,
    PropertiesTable,
    PropertyName,
    PropertyVal,
    Property

}