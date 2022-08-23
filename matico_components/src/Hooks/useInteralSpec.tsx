import {
    ContainerPane,
    Page,
    PanePosition,
    PaneRef
} from "@maticoapp/matico_types/spec";
import React from "react";

interface InternalSpec {
    position: PanePosition;
    paneRef: PaneRef;
    normalizedPane: any;
    parent: ContainerPane | Page;
    updatePane: (update: any) => void;
    selectPane: () => void;
    updatePanePosition: (position: PanePosition) => void;
    direction?: "row" | "column";
    allowOverflow?: boolean;
    [key: string]: any;
}

const InternalSpecContext = React.createContext<InternalSpec>(null);

export const InternalSpecProvider: React.FC<{
    children: React.ReactNode;
    value: InternalSpec;
}> = ({ children, value }) => {
    return (
        <InternalSpecContext.Provider value={value}>
            {children}
        </InternalSpecContext.Provider>
    );
};

export const useInternalSpec = () => {
    const ctx = React.useContext(InternalSpecContext);
    if (!ctx) {
        throw new Error(
            "useInternalSpec must be used within a InternalSpecProvider"
        );
    }
    return ctx;
};
