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
    height: 97vh;
    max-width: 40vw;
    overflow: auto;
    padding: 0px 0px;
    margin-right: 20px;
`;
export const Styles = {
    Content,
    Map,
    Table,
};
