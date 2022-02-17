import React from 'react';
import {
    Grid,
    repeat,
  } from "@adobe/react-spectrum";

export function DefaultGrid(props: any){
    const { children } = props;
    return <Grid alignItems="end" columns={repeat('auto-fit', 'size-2400')} autoRows={"size-800"} gap="size-100" {...props}>
        {children}
    </Grid>
}