import React, { useRef, useEffect, useLayoutEffect } from "react";
import { LabelGroupSpec } from "./types";
import styled from "styled-components";
import { useResizeObserver } from "@dnd-kit/core/dist/hooks/utilities";

const LabelGroupContainer = styled.span<{ target: string; width: number }>`
    margin: 0;
    padding: 0;

    * ${({ target }) => target} {
        min-width: ${({ width }) => width}px !important;
    }
`;
interface UseLabelGroupingSpec {
    target: string;
    ref: React.RefObject<HTMLDivElement>;
}
type useLabelGrroupingFn = (spec: UseLabelGroupingSpec) => { minWidth: number }; // elements: React.ReactElement[]};

const useLabelGrouping: useLabelGrroupingFn = ({ target, ref }) => {
    const minWidth = 0;
    try {
        console.log("ref", target);
        console.log("ref", ref?.current?.children);
    } catch {}
    // useLayoutEffect(() => {
    // console.log('ref', ref?.current?.querySelector(target));
    // }, [ref]);
    // useEffect(() => {
    //     const refObserver = new ResizeObserver(triggerResize);
    //     refObserver.observe(parentRef.current);
    //     return () => {
    //         refObserver.disconnect();
    //     };
    // }, []);

    return {
        minWidth
        // elements
    };
};

export const LabelGroup: React.FC<LabelGroupSpec> = ({ target, children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { minWidth } = useLabelGrouping({
        target,
        ref: containerRef
    });

    return (
        <LabelGroupContainer
            ref={containerRef}
            target={target}
            width={minWidth}
        >
            {children}
        </LabelGroupContainer>
    );
};
