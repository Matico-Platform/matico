import React from "react";

const PageContext = React.createContext({
    navigateToPage: () => null
});

export const PageProvider: React.FC<{
    navigateToPage: any;
    children: React.ReactNode;
}> = ({ navigateToPage, children }) => {
    return (
        <PageContext.Provider value={navigateToPage}>
            {children}
        </PageContext.Provider>
    );
};

export const usePageContext = () => {
    const ctx = React.useContext(PageContext);
    if (ctx === undefined) throw Error("Not wrapped in <DraggingProvider />.");
    return ctx;
};
