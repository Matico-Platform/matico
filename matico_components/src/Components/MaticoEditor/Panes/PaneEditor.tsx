import React from "react";
import { MaticoPaneInterface } from "Components/Panes/Pane";
import {
  Flex,
  TextField,
  Well,
  Grid,
  Text,
  Heading,
  repeat,
  Item,
  NumberField,
  Picker,
} from "@adobe/react-spectrum";

interface PaneEditorProps extends MaticoPaneInterface {
  onChange: (update: MaticoPaneInterface) => void;
}

interface PositionUnitEditorProps {
  label: string;
  value: number;
  units: "Percent" | "Pixels";
  onValueChange: (value: number) => void;
  onUnitsChange: (units: "Percent" | "Pixels") => void;
}

const PositionUnitEditor: React.FC<PositionUnitEditorProps> = ({
  label,
  value,
  units,
  onValueChange,
  onUnitsChange,
}) => {
  return (
    <Flex direction="row">
      <NumberField
        width={"size-1200"}
        label={label}
        marginEnd={"size-100"}
        value={value}
        onChange={onValueChange}
      />
      <Picker
        width={"size-1200"} label="units"
        selectedKey={units}
        onSelectionChange={onUnitsChange}
      >
        <Item key="Percent">%</Item>
        <Item key="Pixels">px</Item>
      </Picker>
    </Flex>
  );
};

export const PaneEditor: React.FC<PaneEditorProps> = ({
  position,
  background,
  onChange,
  name,
}) => {
  const updatePosition = (change: any) => {
    console.log("Name ", change);
    onChange({
      background,
      //@ts-ignore
      position: { ...position, ...change },
      name,
    });
  };

  const updateName = (newName: string) => {
    onChange({
      background,
      position,
      name: newName,
    });
  };

  return (
    <Flex direction="column" width="100%" height="100%">
      <Well>
        <Heading>Pane Details</Heading>
        <TextField
          label="name"
          value={name}
          onChange={(name: string) => updateName( name )}
        />
        <Grid columns={["1fr 1fr"]} autoRows="size-800">
          <PositionUnitEditor
            label="x"
            value={position.x}
            units={position.x_units}
            onValueChange={(x) => updatePosition({ x })}
            onUnitsChange={(x_units) => updatePosition({ x_units })}
          />
          <PositionUnitEditor
            label="y"
            value={position.y}
            units={position.y_units}
            onValueChange={(y) => updatePosition({ y })}
            onUnitsChange={(y_units) => updatePosition({ y_units })}
          />
          <PositionUnitEditor
            label="width"
            value={position.width}
            units={position.width_units}
            onValueChange={(width) => updatePosition({ width })}
            onUnitsChange={(width_units) => updatePosition({ width_units })}
          />
          <PositionUnitEditor
            label="height"
            value={position.height}
            units={position.height_units}
            onValueChange={(height) => updatePosition({ height })}
            onUnitsChange={(height_units) => updatePosition({ height_units })}
          />
        </Grid>
      </Well>
    </Flex>
  );
};
