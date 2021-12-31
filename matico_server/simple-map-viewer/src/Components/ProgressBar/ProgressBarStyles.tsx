import styled from 'styled-components';

const ProgressBarOuter = styled.div`
    width: 100%;
    flex: 1;
    height: 20px;
    padding: 5px;
    display: flex;
    border: 1px solid grey;
    border-radius: 10px;
`;

interface ProgressBarInnerProps {
    percent: number;
}

const ProgressBarInner = styled.div`
    width: ${({ percent }: ProgressBarInnerProps) => `${percent}%`};
    height: 15px;
    background-color: blue;
`;

const Percent = styled.span``;
export const Styles = {
    ProgressBarOuter,
    ProgressBarInner,
    Percent,
};
