import styled from 'styled-components';

const DataTable = styled.div`
    flex: 1;
    width: 100%;
    height: 100%;
     text-align: left;
  position: relative;
  border-collapse: collapse; 
  table-layout:fixed;

`;

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
    flex: 1;
    height: 100%;
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
        overflow-y: auto;
    }
`;
export const Styles = {
    DataTable,
    Table,
    TableRow
};
