import React, { useEffect } from "react";
import { ChartSpaceSpec } from "./types";
import { ChartSpaceEngine } from "./ChartSpaces/ChartSpaceEngine";
import { useResizeEvent } from "../Hooks/useResizeEvent";
import { useStore } from "../Store/maticoChartStore";

export default function MaticoChart(props: ChartSpaceSpec) {
    const parentRef = React.useRef<HTMLDivElement>(null);
    const setMultiple = useStore((state) => state.setMultiple);

    useEffect(() => {
        console.log("setting initial props");
        setMultiple(props);
    }, []);

    useEffect(() => {
        console.log("props changed, setting state");
        setMultiple(props);
    }, [props.updateTrigger || JSON.stringify(props)]);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
            }}
            ref={parentRef}
        >
            <svg style={{ width: "100%", height: "100%" }}>
                <ChartSpaceEngine />
                <ParentSizeObserver parentRef={parentRef} />
            </svg>
        </div>
    );
}

const ParentSizeObserver: React.FC<{
    parentRef: React.RefObject<HTMLDivElement>;
}> = ({ parentRef }) => {
    const setDimensions = useStore((state) => state.setDimensions);

    const handleResize = React.useCallback(() => {
        if (parentRef.current) {
            const { height, width } = parentRef.current.getBoundingClientRect();
            setDimensions(height, width);
        }
    }, []);

    useResizeEvent(handleResize, parentRef);
    return null;
};
