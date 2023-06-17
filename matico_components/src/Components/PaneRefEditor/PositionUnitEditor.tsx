import { Grid, Text, View, Flex, NumberField, Picker, Item } from "@adobe/react-spectrum";
import { ScreenUnits } from "@maticoapp/matico_types/spec";
import React from "react";

interface PositionUnitEditorProps {
  label: string;
  value: number;
  units: ScreenUnits;
  onValueChange: (value: number) => void;
  onUnitsChange: (units: ScreenUnits) => void;
}

export const PositionUnitEditor: React.FC<PositionUnitEditorProps> = ({
  label,
  value,
  units,
  onValueChange,
  onUnitsChange
}) => {
  return (
    <Grid
      areas={["Label Interface"]}
      columns={["33.3%", "66.6%"]}
      gap="size-50"
    >
      <Text gridArea={"Label"} alignSelf="center" justifySelf="end">
        {label}
      </Text>
      <View gridArea={"Interface"} marginTop="size-100">
        <View
          backgroundColor="gray-75"
          borderColor="gray-400"
          borderWidth="thin"
        >
          <Flex direction="row" marginX="size-100">
            <NumberField
              value={value}
              onChange={onValueChange}
              hideStepper
              isQuiet
            />
            <Picker
              selectedKey={units}
              onSelectionChange={onUnitsChange}
              aria-label={`${label} units`}
              isQuiet
            >
              <Item key="percent">%</Item>
              <Item key="pixels">px</Item>
            </Picker>
          </Flex>
        </View>
      </View>
    </Grid>
  );
};
