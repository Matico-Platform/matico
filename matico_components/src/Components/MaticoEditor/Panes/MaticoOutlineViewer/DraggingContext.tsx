import React from "react";

const DraggingContext = React.createContext({
    activeItem: null
});

export const DraggingProvider: React.FC<{
    activeItem: any;
    children: React.ReactNode;
}> = ({ activeItem, children }) => {
    return (
        <DraggingContext.Provider value={activeItem}>
            {children}
        </DraggingContext.Provider>
    );
};

export const useDraggingContext = () => {
    const ctx = React.useContext(DraggingContext);
    if (ctx === undefined) throw Error("Not wrapped in <DraggingProvider />.");
    return ctx;
};
