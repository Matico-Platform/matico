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
  ActionGroup,
  Icon,
} from "@adobe/react-spectrum";
import { DefaultGrid } from "../Utils/DefaultGrid";
import { TwoUpCollapsableGrid } from "../Utils/TwoUpCollapsableGrid";
import TextStyle from "@spectrum-icons/workflow/TextStyle";

interface PaneEditorProps extends MaticoPaneInterface {
  onChange: (update: MaticoPaneInterface) => void;
  parentLayout: string;
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
        width="50%"
        label={label}
        marginEnd={"size-100"}
        value={value}
        onChange={onValueChange}
      />
      <Picker
        width="50%"
        label="units"
        selectedKey={units}
        onSelectionChange={onUnitsChange}
      >
        <Item key="Percent">%</Item>
        <Item key="Pixels">px</Item>
      </Picker>
    </Flex>
  );
};

const PositionPresets = [
  { id: 'full', label: "▣ Full", position: {
    x:0,
    y:0,
    width:100,
    height:100
  } },
  { id: 'half-l', label: "◧ Snap Left", position: {
    x:0,
    y:0,
    width:50,
    height:100
  } },
  { id: 'half-r', label: "◨ Snap Right", position: {
    x:50,
    y:0,
    width:50,
    height:100
  } },
  { id: 'quad-t-l', label: "◰ Snap Top Left", position: {
    x:0,
    y:50,
    width:50,
    height:50
  } },
  { id: 'quad-t-r', label: "◳ Snap Top Right", position: {
    x:50,
    y:50,
    width:50,
    height:50
  } },
  { id: 'quad-b-l', label: "◱ Snap Bottom Left", position: {
    x:0,
    y:0,
    width:50,
    height:50
  } },
  { id: 'quad-b-r', label: "◲ Snap Bottom Right", position: {
    x:50,
    y:0,
    width:50,
    height:50
  } }
]

const SnapPaneMenu: React.FC<{ updatePosition: (change: any) => void }> = ({
  updatePosition
}) => {
  return <ActionGroup
    overflowMode="collapse"
    marginTop={"size-150"}
    summaryIcon={<TextStyle />}
    aria-label="Text style"
    isEmphasized
    onAction={(key) => {
      const position = PositionPresets.find(f => f.id === key)?.position
      !!position && updatePosition({...position, height_units: 'Percent', width_units: 'Percent', x_units: 'Percent', y_units: 'Percent'})
    }}
  >
    {PositionPresets.map(({ id, label }) =>
      <Item key={id} textValue={label.slice(2)}>
        <Text>{label}</Text>
      </Item>
    )}
  </ActionGroup>
}

export const PaneEditor: React.FC<PaneEditorProps> = ({
  position,
  background,
  onChange,
  name,
  parentLayout
}) => {
  const isLinearLayout = parentLayout === 'linear'
  const isFreeLayout = parentLayout === 'free'

  const updatePosition = (change: any) => {
    // console.log("Name ", change);
    // console.log('POSITION', { ...position })
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
  console.log('POSITION', position)

  return (
    <Flex direction="column" width="100%" height="100%">
      <Well>
        <Heading>Pane Details</Heading>
        <TextField
          width="100%"
          label="name"
          value={name}
          onChange={(name: string) => updateName(name)}
        />
        {isFreeLayout && <TwoUpCollapsableGrid>
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
        </TwoUpCollapsableGrid>}
        <TwoUpCollapsableGrid>
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
        </TwoUpCollapsableGrid>
        {isFreeLayout && <SnapPaneMenu {...{ updatePosition }} />}
      </Well>
    </Flex>
  );
};
