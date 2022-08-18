import React from "react";
import styled from "styled-components";
import { PanePosition, PaneRef } from "@maticoapp/matico_types/spec";
import { View } from "@adobe/react-spectrum";
import { PaneSelector } from "Utils/paneEngine";
import { ControlActionBar } from "Components/MaticoEditor/Utils/ControlActionBar";

const FreeArea = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    flex: 1;
`;
/**
 * If the unit is Percent, return %, otherwise return px.
 * @param {string} unit - The unit of the value.
 */
const handleUnits = (unit: string) => (unit === "percent" ? "%" : "px");

/**
 * If the values and units are not undefined, then map over the values and units and join them together
 * with a space, for use in the style attribute.
 * @param {Array<number | undefined>} values - number[] | undefined
 * @param {Array<string | undefined>} units - string[] | undefined
 * @returns A string.
 */
const handlePositionalRule = (
    values: Array<number | undefined>,
    units: Array<string | undefined>
) => {
    if (!values || !units) {
        return "auto";
    } else {
        return values
            .map(
                (value, index) =>
                    `${value || 0}${handleUnits(units[index] || "")}`
            )
            .join(" ");
    }
};

const FreePane: React.FC<PanePosition> = ({
    width,
    height,
    layer,
    widthUnits,
    heightUnits,
    x,
    xUnits,
    y,
    yUnits,
    padBottom,
    padLeft,
    padRight,
    padTop,
    padUnitsBottom,
    padUnitsLeft,
    padUnitsRight,
    padUnitsTop,
    children
}) => {
    return (
        <View
            position="absolute"
            width={`${width}${handleUnits(widthUnits)}`}
            height={`${height}${handleUnits(heightUnits)}`}
            zIndex={layer}
            left={`${x}${handleUnits(xUnits)}`}
            bottom={`${y}${handleUnits(yUnits)}`}
            backgroundColor={"static-black"}
            paddingBottom={`${padBottom}${handleUnits(padUnitsBottom)}`}
            paddingStart={`${padLeft}${handleUnits(padUnitsLeft)}`}
            paddingEnd={`${padRight}${handleUnits(padUnitsRight)}`}
            paddingTop={`${padTop}${handleUnits(padUnitsTop)}`}
            UNSAFE_style={{
                transition:
                    "bottom 250ms, left 250ms, width 250ms, height 250ms, background 250ms",
                boxShadow:
                    "0px 10px 15px -3px rgba(0,0,0,0.1),3px -7px 15px -3px rgba(0,0,0,0.05)",
                boxSizing: "border-box"
            }}
            id="testtest"
        >
            {children}
        </View>
    );
};

export interface MaticoFreeLayoutInterface {
    paneRefs: Array<PaneRef>;
}

export const MaticoFreeLayout: React.FC<MaticoFreeLayoutInterface> = ({
    paneRefs
}) => {
    return (
        <FreeArea>
            {paneRefs.slice(0).reverse().map((paneRef) => (
                <FreePane key={paneRef.id} {...paneRef.position}>
                    <PaneSelector paneRef={paneRef} />
                </FreePane>
            ))}
        </FreeArea>
    );
};
