import styled from 'styled-components';
import { Paper } from 'Components/Layout/Layout';
import {Pagination} from 'Components/Pagination/Pagination'

const Content = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 400px;
    grid-row-gap: 20px;
    grid-column-gap: 20px;
    grid-template-areas:
        'table map'
        'details details';
    flex-direction: row;
    width: 100%;
    height: 100%;
    padding: 20px;
`;

const Map = styled(Paper)`
    position: relative;
    grid-area: map;
`;

const TablePagination = styled.div`
    width:100%;
    background-color:#ffffff;
    position:absolute;
    bottom:0px;
    left:0px;
    padding:20px;
`
const Table = styled(Paper)`
    max-width: 100%;
    max-height: 100%;
    min-width: 0px;
    min-height: 0px;
    grid-area: table;
    position:relative;
    div{
        position: absolute;
        bottom:0px;
        left:0px;
        width:100%;
        background-color:white;
    }

    
`;

const Details = styled(Paper)`
    grid-area: details;
    display:flex;
    
`;

export const Styles = {
    Content,
    Map,
    Table,
    Details,
    TablePagination
};
