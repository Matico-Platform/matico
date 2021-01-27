import styled from 'styled-components'

const DatasetViewPageContainer = styled.div`
    display:flex;
    flex-direction:row;
`

const DataTable= styled.table`
    width:50%;
    table-layout: fixed;
    background-color:white;
    padding:20px;
    tr{
        :hover{
            background-color:grey;
            cursor:pointer;
        }
    }
`

const Map = styled.div`
    width:50%;
    height:100%;
    position:relative;
`

export const Styles={
    DataTable,
    DatasetViewPageContainer,
    Map
}