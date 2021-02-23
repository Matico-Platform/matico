import styled from 'styled-components';

const QueryPane = styled.div``;

const Buttons = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 10px 0px;
    > * {
        margin-left: 10px;
    }
`;

const ButtonsAndErrors = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Error = styled.p`
    color: red;
`;
export const Styles = {
    QueryPane,
    Buttons,
    ButtonsAndErrors,
    Error,
};
