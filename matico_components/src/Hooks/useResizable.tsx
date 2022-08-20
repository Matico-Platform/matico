import React, { useState } from "react";
export interface ResizableDimensions {
    currWidth: number;
    currHeight: number;
    deltaX: number;
    deltaY: number;
    initialRect: DOMRect;
    newRect: DOMRect;
}

interface ResizableProps {
    ref: React.RefObject<HTMLElement>;
    onResizeStart?: (dimensions: ResizableDimensions) => void;
    onResizeMove?: (dimensions: ResizableDimensions) => void;
    onResizeEnd?: (dimensions: ResizableDimensions) => void;
    resetDims?: boolean;
}

const initialDims = {
    currWidth: 0,
    currHeight: 0,
    deltaX: 0,
    deltaY: 0,
    initialRect: new DOMRect(),
    newRect: new DOMRect()
};

export const useResizable = ({
    ref,
    onResizeStart,
    onResizeMove,
    onResizeEnd,
    resetDims = true
}: ResizableProps) => {
    const [dims, setDims] = useState<ResizableDimensions>(initialDims);
    const [active, setActive] = useState<boolean>(false);
    const [indicatorStyles, setIndicatorStyles] = useState<React.CSSProperties>(
        {
            position: "absolute",
            left: 0,
            top: 0,
            width: 0,
            height: 0
        }
    );

    const startResize = () => {
        setActive(true);
        bindEvents();
        if (ref.current) {
            const initialRect = ref.current.getBoundingClientRect();

            const newDims = {
                ...dims,
                initialRect,
                currWidth: initialRect.width,
                currHeight: initialRect.height
            };
            setDims(newDims);
            onResizeStart && onResizeStart(newDims);
        }
    };
    const calculateDims = (e: MouseEvent, prev?: ResizableDimensions) => {
        const initialRect = ref.current.getBoundingClientRect();
        const deltaX = e.clientX - initialRect.x - initialRect.width;
        const deltaY = e.clientY - initialRect.y - initialRect.height;
        const newWidth = initialRect.width + deltaX;
        const newHeight = initialRect.height + deltaY;
        const newX = newWidth > 0 ? initialRect.x : initialRect.x + newWidth;
        const newY = newHeight > 0 ? initialRect.y : initialRect.y + newHeight;
        const newRect = new DOMRect(
            newX,
            newY,
            Math.abs(newWidth),
            Math.abs(newHeight)
        );

        const newDims = {
            ...(prev || {}),
            deltaX,
            deltaY,
            newRect
        } as ResizableDimensions;
        let styles = {
            position: "fixed",
            width: Math.abs(newRect.width),
            height: Math.abs(newRect.height),
            left: newRect.x,
            top: newRect.y
        };
        return {
            styles,
            newDims
        };
    };

    const onMouseUp = (e: MouseEvent) => {
        unbindEvents();
        const { newDims } = calculateDims(e, dims);
        onResizeEnd && onResizeEnd(newDims);
        resetDims && setDims(initialDims);
        setActive(false);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (ref.current) {
            setDims((prev) => {
                const { styles, newDims } = calculateDims(e, prev);
                // @ts-ignore
                setIndicatorStyles(styles);
                onResizeMove && onResizeMove(newDims);
                return newDims;
            });
        }
    };

    const bindEvents = () => {
        if (typeof window !== undefined) {
            window.addEventListener("mouseup", onMouseUp);
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseleave", onMouseUp);
            window.addEventListener("touchmove", onMouseMove, {
                capture: true,
                passive: false
            });
            window.addEventListener("touchend", onMouseUp);
        }
    };

    const unbindEvents = () => {
        if (typeof window !== undefined) {
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseleave", onMouseUp);
            window.removeEventListener("touchmove", onMouseMove, true);
            window.removeEventListener("touchend", onMouseUp);
        }
    };

    return {
        active,
        dims,
        startResize,
        indicatorStyles
    };
};
