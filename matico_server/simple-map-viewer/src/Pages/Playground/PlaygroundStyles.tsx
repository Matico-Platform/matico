import styled from 'styled-components';

const Playground = styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: 25vw 1fr;
`;

const Code = styled.div`
    display: flex;
    flex-direction: column;
`;

const Map = styled.div``;

const Buttons = styled.div`
    color: black;
    text-align: right;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const Styles = {
    Playground,
    Code,
    Map,
    Buttons,
};
