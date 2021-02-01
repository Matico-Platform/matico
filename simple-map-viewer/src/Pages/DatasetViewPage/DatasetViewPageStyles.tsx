import styled from 'styled-components';
import {Paper} from '../../Components/Layout/Layout'

const Content = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 0.8fr;
    grid-row-gap:20px;
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

const Table = styled(Paper)`
    max-width:100%;
    max-height:100%;
    min-width: 0px;
    min-height: 0px;
    grid-area:table;
`;

const Details= styled(Paper)`
    grid-area:details;
`;

export const Styles = {
    Content,
    Map,
    Table,
    Details
};
