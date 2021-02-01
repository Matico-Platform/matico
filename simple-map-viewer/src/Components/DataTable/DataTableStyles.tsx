import styled from 'styled-components';


const DataTable = styled.div`
    height:100%;
    width:100%;
    flex:1;
    overflow:auto;
    position:relative;
    max-height:50vh;
`
interface TableRowProps{
    selected? : boolean,
    theme?: any
}
const TableRow = styled.tr<TableRowProps>`
    cursor: pointer;
    :hover{
        background-color: ${(props:TableRowProps)=> props.selected ? props.theme.colors.secondaryLight : 'lightgrey' }; 
    }
    background-color: ${(props:TableRowProps)=> props.selected ? props.theme.colors.secondaryLight : 'inherit' }; 
    height:20px;
`

const Table = styled.table`
    background-color: white;
    border-collapse: collapse; 
    table-layout:fixed;
    text-align: left;
    position: relative;
    th {
        background-color: ${({ theme }) => theme.colors.main};
        color:white;
        font-weight: bold;
        font-size:15px;
        position: sticky;
        top: 0; /* Don't forget this, required for the stickiness */
        box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
        padding:10px 20px;
        border-right: 2px solid white;
    }
    td {
        padding: 10px 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size:13px;
        max-width: 200px;
        height:20px;
    }
    tbody {
    }
`;
export const Styles = {
    Table,
    TableRow,
    DataTable
};
