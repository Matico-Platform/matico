import styled from 'styled-components';

export const Form = styled.form`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    align-items: center;

    h3 {
        grid-column: 1 / span 2;
        text-align: center;
        font-weight: bold;
    }
    button {
        margin-top: 20px;
        grid-column: 1 / span 2;
    }
    .errorMsg{
        color:red;
        grid-column: 1/ span 2;
        text-align:right;
        font-size: 15px;
    }
    label {
        justify-self: center;
    }
`;
