import React, { useMemo } from "react";
import { RangeSlider } from "@adobe/react-spectrum";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { v4 as uuid } from "uuid";

interface MaticoRangeControlInterface {
    controlPaneId: string;
    min: number;
    max: number;
    step: number;
    name: string;
}

export const MaticoRangeControl: React.FC<MaticoRangeControlInterface> = ({
    controlPaneId,
    min,
    max,
    step,
    name
}) => {
    const [value, updateValue] = useAutoVariable({
        variable: {
            id: controlPaneId,
            paneId: controlPaneId,
            name: `range_control_${name}`,
            value: {
                type: "range",
                value: { min, max }
            }
        },
        bind: true
    });

    return (
        <RangeSlider
            width="100%"
            label={name}
            value={{ start: value?.value?.min, end: value?.value?.max }}
            minValue={min}
            maxValue={max}
            step={step}
            onChange={(val) =>
                updateValue({
                    type: "range",
                    value: { min: val.start, max: val.end }
                })
            }
        />
    );
};
