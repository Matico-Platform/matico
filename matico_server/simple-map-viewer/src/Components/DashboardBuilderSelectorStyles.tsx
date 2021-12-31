import styled from 'styled-components';

const Selector = styled.section`
    padding-left: 20px;
    border-left: 1px solid white;
`;

const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .icon {
        margin-right: 10px;
    }
`;
const Modes = styled.p`
    display: flex;
    flex-direction: row;
`;

export const Styles = {
    Selector,
    Header,
    Modes,
};
