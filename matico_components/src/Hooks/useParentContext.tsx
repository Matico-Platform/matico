import React, { useEffect } from "react";

const ParentContext = React.createContext<DOMRect>(new DOMRect());

export const ParentProvider: React.FC<{
    children: React.ReactNode;
    parentRef: React.RefObject<HTMLElement>;
    useViewPortY?: boolean;
    useViewPortX?: boolean;
    useViewPortHeight?: boolean;
    useViewPortWidth?: boolean;
}> = ({ children, parentRef, useViewPortY,
    useViewPortX,
    useViewPortHeight,
    useViewPortWidth }) => {
    const [parentDimension, setParentDimension] = React.useState<DOMRect>(
        new DOMRect()
    );
    const listener = () => {
        const parentDimension = parentRef.current?.getBoundingClientRect();
        setParentDimension(
            new DOMRect(
                useViewPortY && typeof window !== undefined ? 0 : parentDimension.x,
                useViewPortX && typeof window !== undefined ? 0 : parentDimension.y,
                useViewPortHeight && typeof window !== undefined ? window.innerWidth : parentDimension.width,
                useViewPortWidth && typeof window !== undefined ? window.innerWidth : parentDimension.height
            )
        );
    };

    useEffect(() => {
        listener();
        const refObserver = new ResizeObserver(listener)
        refObserver.observe(parentRef.current);
        typeof window !== "undefined" &&
            window.addEventListener("resize", listener);
        return () => {
            typeof window !== "undefined" &&
                window.removeEventListener("resize", listener);
            refObserver.disconnect();
        };
    }, []);

    return (
        <ParentContext.Provider value={parentDimension}>
            {children}
        </ParentContext.Provider>
    );
};

export const useParentContext = () => {
    const ctx = React.useContext(ParentContext);
    if (!ctx) {
        throw new Error(
            "useParentContext must be used within a ParentProvider"
        );
    }
    return ctx;
};
