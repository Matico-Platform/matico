import React, { useEffect, useMemo, useState } from "react";
import { RangeSlider } from "@adobe/react-spectrum";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { v4 as uuid } from "uuid";

interface MaticoRangeControlInterface {
    controlPaneId: string;
    min: number;
    max: number;
    step: number;
    name: string;
    changeEvent?: string;
}

export const MaticoRangeControl: React.FC<MaticoRangeControlInterface> = ({
    controlPaneId,
    min,
    max,
    step,
    name,
    changeEvent
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
    const [internalValue, setIntervalValue] = useState(value || {start:0, end:1});

    useEffect(() => {
        setIntervalValue({
            start: value?.value?.min,
            end: value?.value?.max
        });
    }, [value]);

    const handleChange = (val: {start:number, end:number}) => (
        updateValue({
            type: "range",
            value: { min: val.start, max: val.end }
        })
    )

    return (
        <RangeSlider
            width="100%"
            label={name}
            value={internalValue}
            minValue={min}
            maxValue={max}
            step={step}
            onChangeEnd={changeEvent === "onEnd" ? handleChange : undefined}
            onChange={changeEvent !== "onEnd" ? handleChange : setIntervalValue}
        />
    );
};
