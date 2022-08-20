import React from "react";
import {
    PanePosition,
    PaneRef,
    LinearLayoutDirection,
    Justification,
    Alignment,
    GapSize
} from "@maticoapp/matico_types/spec";
import { View, Flex } from "@adobe/react-spectrum";
import { ControlActionBar } from "Components/MaticoEditor/Utils/ControlActionBar";
import { PaneSelector } from "Utils/paneEngine";

type UnitTree = {
    [position: string]: {
        [direction: string]: {
            [unit: string]: string;
        };
    };
};

const unitTree: UnitTree = {
    vertical: {
        row: {
            percent: "%"
        },
        column: {
            percent: "vh"
        }
    },
    horizontal: {
        row: {
            percent: "vw"
        },
        column: {
            percent: "%"
        }
    }
};

/**
 * If the position is horizontal, then return the result of calling handleHorizontalUnits with the
 * unit, otherwise return the result of calling handleVerticalUnits with the unit.
 * @param {string} unit - string - The unit to be converted.
 * @param {'vertical' | 'horizontal'} position - 'vertical' | 'horizontal'
 * @param {'row | 'column'} direction - 'row' | 'column'
 */
const handleUnits = (
    unit: string,
    position: "vertical" | "horizontal",
    direction: "row" | "column"
) => {
    if (unit === "pixels") {
        return "px";
    } else {
        return unitTree[position][direction][unit];
    }
};

/**
 * If the values and units are not undefined, then map over the values and units and join them together
 * with a space, for use in the style attribute.
 * @param {Array<number | undefined>} values - number[] | undefined
 * @param {Array<string | undefined>} units - string[] | undefined
 * @returns A string.
 */
const handlePositionalRule = (
    values: Array<number | undefined>,
    units: Array<string | undefined>,
    direction: "row" | "column"
) => {
    if (!values || !units) {
        return "auto";
    } else {
        return values
            .map(
                (value, index) =>
                    `${value || 0}${handleUnits(
                        units[index] || "",
                        index % 2 === 0 ? "vertical" : "horizontal",
                        direction
                    )}`
            )
            .join(" ");
    }
};

const LinearPane: React.FC<
    PanePosition & { allowOverflow?: boolean; direction?: "row" | "column" }
> = ({
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
    children,
    allowOverflow,
    direction
}) => {
    return (
        <View
            width={`${width}${handleUnits(
                widthUnits,
                "horizontal",
                direction
            )}`}
            height={`${height}${handleUnits(
                heightUnits,
                "vertical",
                direction
            )}`}
            maxWidth={"100%"}
            zIndex={layer}
            paddingBottom={`${padBottom}${handleUnits(
                padUnitsBottom,
                "vertical",
                direction
            )}`}
            paddingStart={`${padLeft}${handleUnits(
                padUnitsLeft,
                "horizontal",
                direction
            )}`}
            paddingEnd={`${padRight}${handleUnits(
                padUnitsRight,
                "horizontal",
                direction
            )}`}
            paddingTop={`${padTop}${handleUnits(
                padUnitsTop,
                "vertical",
                direction
            )}`}
            UNSAFE_style={{
                transition:
                    "bottom 250ms, left 250ms, width 250ms, height 250ms, background 250ms",
                boxShadow:
                    "0px 10px 15px -3px rgba(0,0,0,0.1),3px -7px 15px -3px rgba(0,0,0,0.05)",
                boxSizing: "border-box"
            }}
            flexShrink={allowOverflow ? 0 : 1}
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
    gap?: GapSize;
    allowOverflow?: boolean;
}

const GapVals = {
    none: "size-0",
    small: "size-100",
    medium: "size-600",
    large: "size-1000"
};

export const MaticoLinearLayout: React.FC<MaticoLinearLayoutInterface> = ({
    paneRefs,
    direction,
    align,
    justify,
    gap,
    allowOverflow
}) => {
    return (
        <View
            width="100%"
            height="100%"
            overflow={`${allowOverflow && direction === "row" ? "auto" : "hidden"} ${allowOverflow && direction === "column" ? "auto" : "hidden"}
            `}
        >
            <Flex
                id="layout-engine"
                position="relative"
                width={
                    allowOverflow && direction === "row"
                        ? "fit-content"
                        : "100%"
                }
                height={
                    allowOverflow && direction === "column"
                        ? "fit-content"
                        : "100%"
                }
                direction={direction}
                alignContent={align}
                justifyContent={justify}
                gap={GapVals[gap]}
            >
                {paneRefs.map((paneRef: PaneRef) => (
                    <LinearPane
                        key={paneRef.id}
                        allowOverflow={allowOverflow}
                        direction={direction}
                        {...paneRef.position}
                    >
                        {/* <ControlActionBar paneRef={paneRef} /> */}
                        <PaneSelector paneRef={paneRef} />
                    </LinearPane>
                ))}
            </Flex>
        </View>
    );
};
