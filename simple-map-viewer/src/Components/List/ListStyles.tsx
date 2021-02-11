import styled from 'styled-components';
import { Paper } from '../Layout/Layout';
import { Button } from '../Button/Button';

const ListOuter = styled(Paper)`
    width: 100%;
`;

const List = styled.ul``;

const Row = styled.li`
    border-bottom: 1px solid lightgrey;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px;
    color: grey;

    a {
        margin-right: 10px;
    }
    :last-child {
        border: none;
    }
`;

export const Styles = {
    ListOuter,
    List,
    Row,
};
