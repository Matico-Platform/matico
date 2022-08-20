import styled from "styled-components";

export const HoverableItem = styled.span`
    opacity: 0;
    transition: 125ms opacity;
`;

export const HoverableRow = styled.div<{hideBorder?: boolean, squash?: boolean}>`
    position: relative;
    border-bottom: ${({hideBorder}) => hideBorder ? 'none' : '1px solid var(--spectrum-global-color-gray-200)'};
    transition:125ms all;
    ${HoverableItem} {
        width: ${({squash}) => squash ? '0' : 'fit-content'};
        transition: 125ms width;
    }
    &:hover ${HoverableItem}, &:focus-within ${HoverableItem}, &:focus ${HoverableItem} {
        opacity: 1;
        width: fit-content;
    }
`;

export const DragButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: grab;
`;

export const DragContainer = styled.button`
    transition: 250ms box-shadow;
    border: none;
    outline: none;
    background: none;
    padding: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
`;

export const DraggableContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
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
