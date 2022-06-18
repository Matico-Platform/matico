import React from "react";
import { Grid } from "@adobe/react-spectrum";

interface TwoUpCollapsableGridProps {
    props?: any
}

export const TwoUpCollapsableGrid: React.FC<TwoUpCollapsableGridProps> = ({children, ...rest}) => <Grid areas={{
    L:["button1 button2"],
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
    {...rest}
    > {children}
    </Grid>