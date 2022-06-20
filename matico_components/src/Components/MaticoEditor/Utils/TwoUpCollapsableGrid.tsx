import React from "react";
import { Grid } from "@adobe/react-spectrum";
import { DOMRefValue } from "@react-types/shared";

interface TwoUpCollapsableGridProps {
    children: React.ReactNode;
    gridProps?: {[key:string]: any}//React.RefAttributes<DOMRefValue<HTMLDivElement>>
}

export const TwoUpCollapsableGrid: React.FC<TwoUpCollapsableGridProps> = ({ children, gridProps }) => {
    return (
        <Grid
            maxWidth={"100%"}
            width="100%"
            areas={{
                L: ["button1 button2"],
                M: ["button1", "button2"],
                S: ["button1", "button2"],
                base: ["button1", "button2"],
            }}
            columns={{
                L: ["48%", "48%"],
                M: ["100%"],
                S: ["100%"],
                base: ["100%"],
            }}
            gap="size-100"
            {...gridProps}
        >
            {children}
        </Grid>
    )
}