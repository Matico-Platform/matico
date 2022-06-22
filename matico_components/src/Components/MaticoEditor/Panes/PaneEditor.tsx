import React from "react";
import { MaticoPaneInterface } from "Components/Panes/Pane";
import {
  Flex,
  TextField,
  Well,
  Text,
  Heading,
  Item,
  NumberField,
  Picker,
  ActionGroup,
} from "@adobe/react-spectrum";
import { TwoUpCollapsableGrid } from "../Utils/TwoUpCollapsableGrid";
import TextStyle from "@spectrum-icons/workflow/TextStyle";
import {Layout, ScreenUnits} from "@maticoapp/matico_types/spec";
import {PanePosition} from "@maticoapp/matico_spec";

interface PaneEditorProps extends MaticoPaneInterface {
  onChange: (update: PanePosition) => void;
  parentLayout: Layout;
}

interface PositionUnitEditorProps {
  label: string;
  value: number;
  units: ScreenUnits;
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
  onChange,
  parentLayout
}) => {
  const isLinearLayout = parentLayout === 'linear'
  const isFreeLayout = parentLayout === 'free'

  const updatePosition = (change: any) => {
    // console.log("Name ", change);
    // console.log('POSITION', { ...position })
    onChange({
      //@ts-ignore
      position: { ...position, ...change },
    });
  };


  return (
    <Flex direction="column" width="100%" height="100%">
      <Well>
        <Heading>Pane Details</Heading>
        {isFreeLayout && <TwoUpCollapsableGrid>
          <PositionUnitEditor
            label="x"
            value={position.x}
            units={position.xUnits}
            onValueChange={(x) => updatePosition({ x })}
            onUnitsChange={(x_units) => updatePosition({ x_units })}
          />
          <PositionUnitEditor
            label="y"
            value={position.y}
            units={position.yUnits}
            onValueChange={(y) => updatePosition({ y })}
            onUnitsChange={(y_units) => updatePosition({ y_units })}
          />
        </TwoUpCollapsableGrid>}
        <TwoUpCollapsableGrid>
          <PositionUnitEditor
            label="width"
            value={position.width}
            units={position.widthUnits}
            onValueChange={(width) => updatePosition({ width })}
            onUnitsChange={(width_units) => updatePosition({ width_units })}
          />
          <PositionUnitEditor
            label="height"
            value={position.height}
            units={position.heightUnits}
            onValueChange={(height) => updatePosition({ height })}
            onUnitsChange={(height_units) => updatePosition({ height_units })}
          />
        </TwoUpCollapsableGrid>
        {isFreeLayout && <SnapPaneMenu {...{ updatePosition }} />}
        
        <Heading>Pane Padding</Heading>
        <TwoUpCollapsableGrid>
          <PositionUnitEditor
            label="Padding Top"
            value={position.padTop}
            units={position.padUnitsTop}
            onValueChange={(pad_top) => updatePosition({ pad_top })}
            onUnitsChange={(pad_units_top) => updatePosition({ pad_units_top })}
          />
          <PositionUnitEditor
            label="Padding Bottom"
            value={position.padBottom}
            units={position.padUnitsBottom}
            onValueChange={(pad_bottom) => updatePosition({ pad_bottom })}
            onUnitsChange={(pad_units_bottom) => updatePosition({ pad_units_bottom })}
          />
        </TwoUpCollapsableGrid>
        <TwoUpCollapsableGrid>
          <PositionUnitEditor
            label="Padding Left"
            value={position.padLeft}
            units={position.padUnitsLeft}
            onValueChange={(pad_left) => updatePosition({ pad_left })}
            onUnitsChange={(pad_units_left) => updatePosition({ pad_units_left })}
          />
          <PositionUnitEditor
            label="Padding Right"
            value={position.padRight}
            units={position.padUnitsRight}
            onValueChange={(pad_right) => updatePosition({ pad_right })}
            onUnitsChange={(pad_units_right) => updatePosition({ pad_units_right })}
          />
        </TwoUpCollapsableGrid>
      </Well>
    </Flex>
  );
};
