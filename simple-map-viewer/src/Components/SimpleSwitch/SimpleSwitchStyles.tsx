import styled from 'styled-components';

const SimpleSwitch = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const Option = styled.button<{ selected: boolean }>`
    background: none;
    border: none;
    padding: 0px;
    margin: 0px;
    font-weight: ${({ selected }) => (selected ? 700 : 200)};
    cursor: pointer;
`;
export const Styles = {
    SimpleSwitch,
    Option,
};
