import styled from 'styled-components';

const Content = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 20px;
`;

const Map = styled.div`
    flex: 1;
    width: 50%;
    height: 100%;
    position: relative;
    padding: 10px;
`;

const Table = styled.div`
    height: 100%;
    max-width: 40vw;
    overflow-x: auto;
    padding: 10px;
`;
export const Styles = {
    Content,
    Map,
    Table,
};
