import React from "react";
import { RangeSlider } from "@adobe/react-spectrum";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";

interface MaticoRangeControlInterface {
  min: number;
  max: number;
  step: number;
  name: string;
}

export const MaticoRangeControl: React.FC<MaticoRangeControlInterface> = ({
  min,
  max,
  step,
  name,
}) => {
  const [value, updateValue] = useAutoVariable({
    name: `range_control_${name}`,
    type: "any",
    initialValue: { start: min, end: max },
    bind: true,
  });
  return (
    <RangeSlider
      width="100%"
      label={name}
      value={value}
      minValue={min}
      maxValue={max}
      step={step}
      onChange={(val) => updateValue(val)}
    />
  );
};
