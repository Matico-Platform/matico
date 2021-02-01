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
        active ? '2px solid' : 'none'};
    color: white;
    cursor: pointer;
    background-color: ${({active})=> active ? "#c38d9e" : "#eddde2"};
    font-weight: bold;
    flex:1;
    text-align:center;
    padding: 10px;
    font-size:15px;
`;

export const Styles = {
    TabContainer,
    TabHeader,
    Tab,
    TabContent,
};
