import styled from 'styled-components';

const Form = styled.form`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    align-items: center;
    button {
        margin-top: 20px;
        grid-column: 1 / span 2;
    }
    label {
        justify-self: center;
    }
`;

export const Styles = {
    Form,
};
