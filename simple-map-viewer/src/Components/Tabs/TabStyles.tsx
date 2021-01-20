import styled from 'styled-components';

const TabHeader = styled.ul`
    display: flex;
    flex-direction: row;
    padding: 0px 10px 10px 10px;
    justify-content: space-around;
    align-items: center;
`;

const TabContainer = styled.div`
    display: flex;
    flex-direction: column;
`;
export interface TabProps {
    name: string;
}

interface TabHeadProps {
    active: boolean;
}

const TabContent = styled.div``;

const Tab = styled.li`
    border-bottom: ${({ active }: TabHeadProps) =>
        active ? '2px solid white' : 'none'};
    color: white;
    cursor: pointer;
    font-weight: ${({ active }: TabHeadProps) =>
        active ? 'bold' : 'regular'};
`;

export const Styles = {
    TabContainer,
    TabHeader,
    Tab,
    TabContent,
};
