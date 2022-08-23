import styled from "styled-components";

export const ContainerDropTarget = styled.div<{
    active: boolean;
    isOver: boolean;
}>`
    background: ${({ isOver, active }) =>
        isOver && active ? "var(--spectrum-semantic-positive-color-icon)" : "rgba(0,0,0,0)"};
    transition: 125ms all;
    position: relative;
    width:100%;
    height:100%;
    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        pointer-events: none;
        height: 100%;
        border: 1px solid rgba(81, 255, 249, 0.5);
        transition: 125ms all;
        border-left: 3px solid var(--spectrum-semantic-positive-color-icon);
        opacity: ${({ active, isOver }) => (isOver && active ? ".75" : active ? "0.5" : "0")};
    }
`;