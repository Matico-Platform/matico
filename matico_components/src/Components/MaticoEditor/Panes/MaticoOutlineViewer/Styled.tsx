import styled from "styled-components";

export const HoverableItem = styled.span`
    opacity: 0;
    transition: 125ms opacity;
`;

export const HoverableRow = styled.div`
    position: relative;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    &:hover ${HoverableItem} {
        opacity: 1;
    }
`;

export const DragButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: grab;
`;

export const ContainerDropTarget = styled.div<{
    active: boolean;
    isOver: boolean;
    depth: number;
}>`
    background: ${({ isOver }) =>
        isOver ? "var(--spectrum-semantic-positive-color-icon)" : "rgba(0,0,0,0)"};
    transition: 125ms all;
    position: relative;
    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 1px solid rgba(81, 255, 249, 0.5);
        transition: 125ms all;
        border-left: 3px solid var(--spectrum-semantic-positive-color-icon);
        opacity: ${({ active, isOver }) => (isOver ? ".75" : active ? "0.5" : "0")};
    }
`;
export const DragContainer = styled.div`
    transition: 250ms box-shadow;
`;

export const DraggableContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    padding: 0 1em;
    width: 100%;
    height: 2em;
    box-shadow: 0px 0px 5px 0px rgba(32, 255, 251, 0.75);
    background: rgba(0, 0, 0, 0.25);
    color: white;
    svg {
        width: 1.5em;
        margin-right: 1em;
    }
    * {
        flex-grow: 0;
    }
`;
