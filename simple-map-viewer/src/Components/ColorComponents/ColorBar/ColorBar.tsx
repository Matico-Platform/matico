import styled from 'styled-components';
import { Color } from 'types';

interface ColorBarProps {
    col: Color;
}

export const ColorBar = styled.div<ColorBarProps>`
    border: 2px solid white;
    background-color: ${({ col }) => `rgba(${col.join(', ')})`};
    height: 15px;
    cursor: pointer;
`;
