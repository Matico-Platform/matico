import styled from 'styled-components';

const ColorPalette = styled.div`
    h3 {
        color: grey;
        font-size: 10px;
    }
    flex: 1;
`;

const Colors = styled.div`
    display: flex;
    flex-direction: row;
    height: 10px;
    padding: 0px;
`;

const Color = styled.div<{ color: string }>`
    background-color: ${({ color }) => color};
    height: 100%;
    width: ${() => 100 / 8}%;
`;
export const Styles = {
    ColorPalette,
    Colors,
    Color,
};
