import React from "react";
import {
    PanePosition,
    PaneRef,
    LinearLayoutDirection,
    Justification,
    Alignment
} from "@maticoapp/matico_types/spec";
import { View, Flex } from "@adobe/react-spectrum";
import { ControlActionBar } from "Components/MaticoEditor/Utils/ControlActionBar";
import { PaneSelector } from "Utils/paneEngine";

/**
 * If the unit is percent, return percent, otherwise return pixels.
 * @param {string} unit - string - This is the unit that the user has selected in the dropdown.
 */
const handleHorizontalUnits = (unit: string) =>
    unit === "percent" ? "%" : "px";

/**
 * If the unit is Percent, return Viewport height, otherwise return px
 * @param {string} unit - string - This is the unit that the user has selected in the dropdown.
 */
const handleVerticalUnits = (unit: string) =>
    unit === "percent" ? "vh" : "px";

/**
 * If the position is horizontal, then return the result of calling handleHorizontalUnits with the
 * unit, otherwise return the result of calling handleVerticalUnits with the unit.
 * @param {string} unit - string - The unit to be converted.
 * @param {'vertical' | 'horizontal'} position - 'vertical' | 'horizontal'
 */
const handleUnits = (unit: string, position: "vertical" | "horizontal") =>
    position === "horizontal"
        ? handleHorizontalUnits(unit)
        : handleVerticalUnits(unit);

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
                    `${value || 0}${handleUnits(
                        units[index] || "",
                        index % 2 === 0 ? "vertical" : "horizontal"
                    )}`
            )
            .join(" ");
    }
};

const LinearPane: React.FC<PanePosition> = ({
    width,
    height,
    layer,
    widthUnits,
    heightUnits,
    padLeft,
    padRight,
    padBottom,
    padTop,
    padUnitsLeft,
    padUnitsRight,
    padUnitsBottom,
    padUnitsTop,
    children
}) => {
    return (
        <View
            width={`${width}${handleHorizontalUnits(widthUnits)}`}
            height={`${height}${handleVerticalUnits(heightUnits)}`}
            maxWidth={"100%"}
            zIndex={layer}
            paddingBottom={`${padBottom}${handleVerticalUnits(padUnitsBottom)}`}
            paddingStart={`${padLeft}${handleVerticalUnits(padUnitsLeft)}`}
            paddingEnd={`${padRight}${handleVerticalUnits(padUnitsRight)}`}
            paddingTop={`${padTop}${handleVerticalUnits(padUnitsTop)}`}
            UNSAFE_style={{
                transition:
                    "bottom 250ms, left 250ms, width 250ms, height 250ms, background 250ms",
                boxShadow:
                    "0px 10px 15px -3px rgba(0,0,0,0.1),3px -7px 15px -3px rgba(0,0,0,0.05)",
                boxSizing: "border-box"
            }}
        >
            {children}
        </View>
    );
};

export interface MaticoLinearLayoutInterface {
    paneRefs: Array<PaneRef>;
    direction: LinearLayoutDirection;
    align: Alignment;
    justify: Justification;
}

export const MaticoLinearLayout: React.FC<MaticoLinearLayoutInterface> = ({
    paneRefs,
    direction,
    align,
    justify
}) => {
    console.log(" Linear Layout ", direction ,align ,justify)
    return (
        <Flex
            position="relative"
            width="100%"
            height="100%"
            direction={direction}
            alignContent={align}
            justifyContent={justify}
        >
            {paneRefs.map((paneRef: PaneRef) => (
                <LinearPane key={paneRef.id} {...paneRef.position}>
                    <ControlActionBar paneRef={paneRef} />
                    <PaneSelector paneRef={paneRef} />
                </LinearPane>
            ))}
        </Flex>
    );
};
