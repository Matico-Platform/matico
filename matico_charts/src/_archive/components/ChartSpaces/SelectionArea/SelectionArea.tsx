import React, { useMemo, useRef, useState } from "react";
import { useStore } from "../../../Store/maticoChartStore";
import { getBoolOrProperty, isBool } from "../../../Utils";
import { Domain2D, ScaleType } from "../../types";
import { Brush } from "@visx/brush";
import debounce from "lodash/debounce";
import { Scale } from "@visx/brush/lib/types";
import { localPoint } from "@visx/event";
import { EventType } from "@visx/event/lib/types";
import { Group } from "@visx/group";
import { PatternLines } from "@visx/pattern";
// @ts-ignore
import { AnyD3Scale } from "@visx/scale/lib/types";

export const SelectionArea: React.FC = () => {
    const [brushDim, setBrushDim] = useState({
        x0: 0,
        x1: 0,
        y0: 0,
        y1: 0,
    });
    const [dragging, setDragging] = useState(false);
    const [brushing, setBrushing] = useState(false);
    const brushRef = useRef(null);

    const xMax = useStore((state) => state.xMax)!;
    const yMax = useStore((state) => state.yMax)!;
    const xScale = useStore((state) => state.xScale as AnyD3Scale);
    const yScale = useStore((state) => state.yScale as AnyD3Scale);
    const margins = useStore((state) => state.margins)!;
    const useBrush = useStore((state) => state.useBrush);
    const onBrush = useStore((state) => state.onBrush)!;

    const brushDirection = useMemo(() => {
        if (isBool(useBrush) && useBrush) return "both";
        const vertical = getBoolOrProperty(useBrush, false, "vertical");
        const horizontal = getBoolOrProperty(useBrush, false, "horizontal");
        if (vertical && horizontal) return "both";
        if (vertical) return "vertical";
        if (horizontal) return "horizontal";
    }, [JSON.stringify(useBrush || null)]);

    const sanitizeX = (val: number) => {
        if (val > xMax) return xMax;
        if (val < margins.left!) return margins.left!;
        return val;
    };
    const sanitizeY = (val: number) => {
        if (val > yMax) return xMax;
        if (val < margins.top!) return margins.top!;
        return val;
    };

    const onBrushChange = (domain: Domain2D) => {
        if (!domain) return;
        const { x0, x1, y0, y1 } = domain;
        onBrush({
            x0,
            x1,
            y0,
            y1,
        });
        setBrushDim({
            x0,
            x1,
            y0,
            y1,
        });
    };

    const debouncedOnBrushChange = useMemo(
        () => debounce(onBrushChange, 1),
        [JSON.stringify(brushDim)]
    );

    const handleMouseDown = (e: EventType) => {
        if (useBrush) {
            setBrushing(false);
            const { x, y } = localPoint(e) || { x: 0, y: 0 };
            setDragging(true);
            setBrushDim((prev) => ({
                ...prev,
                x0: xScale.invert(sanitizeX(x - margins.left!)),
                y0: yScale.invert(sanitizeY(y - margins.top!)),
                x1: xScale.invert(sanitizeX(x - margins.left!)),
                y1: yScale.invert(sanitizeY(y - margins.top!)),
            }));
        }
    };

    const handleMouseLeave = () => {
        if (useBrush) {
            setDragging(false);
            setBrushing(true);
            onBrush(brushDim);
        }
    };

    const handleMouseMove = (e: EventType) => {
        if (useBrush && dragging) {
            const { x, y } = localPoint(e) || { x: 0, y: 0 };
            setBrushDim((prev) => {
                const newDim = {
                    ...prev,
                    x1: xScale.invert(sanitizeX(x - margins.left!)),
                    y1: yScale.invert(sanitizeY(y - margins.top!)),
                };
                return newDim;
            });
        }
    };

    const debouncedHandleMouseMove = useMemo(
        () => debounce(handleMouseMove, 1),
        [JSON.stringify(brushDim)]
    );

    const shouldRender =
        xMax &&
        yMax &&
        xScale?.invert &&
        yScale?.invert &&
        margins &&
        useBrush &&
        onBrush;

    if (!shouldRender) return null;

    return (
        <Group left={margins.left} top={margins.top}>
            <PatternLines
                id="lines"
                height={5}
                width={5}
                stroke={"rgba(0,0,0,0.25)"}
                strokeWidth={1}
                orientation={["diagonal"]}
            />
            <rect
                x={margins.left}
                y={margins.top}
                width={xMax}
                height={yMax}
                fill="rgba(0,0,0,0)"
                onMouseDown={handleMouseDown}
                onMouseMove={debouncedHandleMouseMove}
                onMouseUp={handleMouseLeave}
                onMouseLeave={handleMouseLeave}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseLeave}
            />
            ;
            {brushing && (
                <Brush
                    xScale={xScale as Scale}
                    yScale={yScale as Scale}
                    width={xMax}
                    height={yMax}
                    margin={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                    handleSize={8}
                    innerRef={brushRef}
                    // resizeTriggerAreas={
                    //   brushInteractionMapping[brushDirection] as ResizeTriggerAreas
                    // }
                    brushDirection={brushDirection}
                    // initialBrushPosition={initialBrushPosition}
                    //@ts-ignore
                    onBrushEnd={debouncedOnBrushChange}
                    selectedBoxStyle={{
                        fill: `url('#lines')`,
                        stroke: "black",
                    }}
                    useWindowMoveEvents
                />
            )}
        </Group>
    );
};
