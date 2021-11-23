import React from 'react';
import useResizeObserver from "@react-hook/resize-observer";

// react.d.ts
type RefObject<T> = {
    readonly current: T | null;
  };
  
export const useSize = (target: RefObject<{}>, datasetReady: boolean) => {
    const [size, setSize] = React.useState({ width: 0, height: 0 });
  
    React.useLayoutEffect(() => {
      if (datasetReady && target && target.current)
        //@ts-ignore
        setSize(target.current.getBoundingClientRect());
    }, [target, datasetReady]);
  
    //@ts-ignore
    useResizeObserver(target, (entry) => setSize(entry.contentRect));
    return size;
};