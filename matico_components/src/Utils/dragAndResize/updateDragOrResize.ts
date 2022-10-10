export const updateDragOrResize = ({
    updatePanePosition,
    parentDimensions,
    xUnits,
    yUnits,
    widthUnits,
    heightUnits,
    newX,
    newY,
    newWidth,
    newHeight
}: {
    updatePanePosition: (position: any) => void;
    parentDimensions: DOMRect;
    xUnits: string;
    yUnits: string;
    widthUnits: string;
    heightUnits: string;
    newX?: number;
    newY?: number;
    newWidth?: number;
    newHeight?: number;
}) => {
    if (!updatePanePosition) return;
    let newDims: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    } = {};

    if (newX !== undefined) {
        newDims.x =
            xUnits === "percent"
                ? Math.round((newX / parentDimensions.width) * 1000) / 10
                : newX;
    }
    if (newY !== undefined) {
        newDims.y =
            yUnits === "percent"
                ? Math.round((newY / parentDimensions.height) * 1000) / 10
                : newY;
    }
    if (newWidth !== undefined) {
        newDims.width =
            widthUnits === "percent"
                ? Math.round((newWidth / parentDimensions.width) * 1000) / 10
                : newWidth;
    }
    if (newHeight !== undefined) {
        newDims.height =
            heightUnits === "percent"
                ? Math.round((newHeight / parentDimensions.height) * 1000) / 10
                : newHeight;
    }
    updatePanePosition(newDims);
};
