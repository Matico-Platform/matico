import styled from 'styled-components';

const DataTable = styled.div`
    flex: 1;
    width: 100%;
    height: 100%;
`;

const Table = styled.table`
    background-color: white;
    flex: 1;
    height: 100%;

    th {
        font-weight: bold;
    }
    td {
        padding: 10px 20px;
    }
    tbody {
        overflow-y: auto;
    }
`;
export const Styles = {
    DataTable,
    Table,
};
