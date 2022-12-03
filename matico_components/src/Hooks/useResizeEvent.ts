import React, { useEffect } from "react";

export const useResizeEvent = (
    callback: () => void | Array<() => void>,
    ref: React.RefObject<HTMLElement>
) => {
    const eventFunction = Array.isArray(callback)
        ? () => callback.forEach((cb) => cb())
        : callback;

    useEffect(() => {
        const refObserver = new ResizeObserver(eventFunction);
        refObserver.observe(ref.current);
        return () => {
            refObserver.disconnect();
        };
    }, []);
};
