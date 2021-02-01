import styled from 'styled-components'
import {Paper} from '../Layout/Layout'

const DatasetListOuter= styled(Paper)`
    width:100%;
`

const DatasetList = styled.ul`
`

const DatasetRow = styled.li`
    border-bottom:1px solid lightgrey;
    display:flex;
    flex-direction:row;
    justify-content: space-between;
    padding:20px;
    color: grey;
    
    :last-child{
        border:none;
    }
`

export const Styles={
    DatasetListOuter,
    DatasetList,
    DatasetRow
}