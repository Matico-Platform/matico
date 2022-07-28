import React from "react";
import { SliderUnitSelectorProps } from "./types";
import _ from "lodash";
import { Flex, Item, NumberField, Picker, Slider, View } from "@adobe/react-spectrum";

export const SliderUnitSelector: React.FC<SliderUnitSelectorProps> = ({
  label,
  value,
  sliderMin,
  sliderMax,
  sliderStep,
  onUpdateValue,
  sliderUnits,
  sliderUnitsOptions,
  onUpdateUnits,
}) => {
  return (
    <View
      backgroundColor="gray-75"
      borderColor="gray-400"
      borderWidth='thin'
      width="100%"
    >
      <Flex
        direction="row"
        marginX="size-100"
        width="100%"
      >
        <Slider
          value={value}
          minValue={sliderMin}
          maxValue={sliderMax}
          step={sliderStep}
          onChange={onUpdateValue}
          flex={"1 1 0px"}
        />
        <NumberField
          value={value}
          onChange={onUpdateValue}
          hideStepper
          isQuiet
          marginX={"size-100"}
          flex={"0 1 1px"}
        />
      </Flex>
      
      {!!sliderUnitsOptions?.length && <Picker
          selectedKey={sliderUnits}
          onSelectionChange={onUpdateUnits}
          arial-label={`${label} units`}
          label='Units'
          labelPosition="side"
          isQuiet
          marginX={"size-100"}
          flex={"1 0 auto"}
        >
          {sliderUnitsOptions.map(({ key, label }) => (
            <Item key={key}>{label}</Item>
          ))}
        </Picker>}
    </View>
  )
}
