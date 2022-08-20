import React, { useEffect } from "react";

const ParentContext = React.createContext<DOMRect>(new DOMRect());

export const ParentProvider: React.FC<{
    children: React.ReactNode;
    parentRef: React.RefObject<HTMLElement>;
}> = ({ children, parentRef }) => {
    const [parentDimension, setParentDimension] = React.useState<DOMRect>(
        new DOMRect()
    );
    const listener = () => {
        const parentDimension = parentRef.current?.getBoundingClientRect();
        setParentDimension(
            new DOMRect(
                parentDimension.x,
                parentDimension.y,
                parentDimension.width,
                parentDimension.height
            )
        );
    };

    useEffect(() => {
        listener();
        typeof window !== "undefined" &&
            window.addEventListener("resize", listener);
        return () => {
            typeof window !== "undefined" &&
                window.removeEventListener("resize", listener);
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
