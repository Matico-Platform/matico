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
  Icon,
  View,
  Grid,
  Divider,
} from "@adobe/react-spectrum";
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
    <Grid
      areas={['Label Interface']}
      columns={['33.3%', '66.6%']}
      gap="size-50"
    >
      <Text
        gridArea={'Label'}
        alignSelf="center"
        justifySelf="end"
      >
        {label}
      </Text>
      <View
        gridArea={'Interface'}
        marginTop="size-100"
      >
        <View
          backgroundColor="gray-75"
          borderColor="gray-400"
          borderWidth='thin'
        >
          <Flex
            direction="row"
            marginX="size-100"
          >
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
              <Item key="Percent">%</Item>
              <Item key="Pixels">px</Item>
            </Picker>
          </Flex>
        </View>
      </View>
    </Grid>
  );
};

const PositionPresets = [
  {
    id: 'full', label: "▣ Full", position: {
      x: 0,
      y: 0,
      width: 100,
      height: 100
    }
  },
  {
    id: 'half-l', label: "◧ Snap Left", position: {
      x: 0,
      y: 0,
      width: 50,
      height: 100
    }
  },
  {
    id: 'half-r', label: "◨ Snap Right", position: {
      x: 50,
      y: 0,
      width: 50,
      height: 100
    }
  },
  {
    id: 'quad-t-l', label: "◰ Snap Top Left", position: {
      x: 0,
      y: 50,
      width: 50,
      height: 50
    }
  },
  {
    id: 'quad-t-r', label: "◳ Snap Top Right", position: {
      x: 50,
      y: 50,
      width: 50,
      height: 50
    }
  },
  {
    id: 'quad-b-l', label: "◱ Snap Bottom Left", position: {
      x: 0,
      y: 0,
      width: 50,
      height: 50
    }
  },
  {
    id: 'quad-b-r', label: "◲ Snap Bottom Right", position: {
      x: 50,
      y: 0,
      width: 50,
      height: 50
    }
  }
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
      !!position && updatePosition({ ...position, height_units: 'Percent', width_units: 'Percent', x_units: 'Percent', y_units: 'Percent' })
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

  console.log('POSITION', position)

  return (
    <Flex direction="column" width="100%" height="100%">

      {isFreeLayout && <React.Fragment>
        <Text>Size and Position</Text>
        <TwoUpCollapsableGrid>
          <PositionUnitEditor
            label="Left"
            value={position.x}
            units={position.x_units}
            onValueChange={(x) => updatePosition({ x })}
            onUnitsChange={(x_units) => updatePosition({ x_units })}
          />
          <PositionUnitEditor
            label="Top"
            value={position.y}
            units={position.y_units}
            onValueChange={(y) => updatePosition({ y })}
            onUnitsChange={(y_units) => updatePosition({ y_units })}
          />
        </TwoUpCollapsableGrid>
      </React.Fragment>}
      <TwoUpCollapsableGrid>
        <PositionUnitEditor
          label="Width"
          value={position.width}
          units={position.width_units}
          onValueChange={(width) => updatePosition({ width })}
          onUnitsChange={(width_units) => updatePosition({ width_units })}
        />
        <PositionUnitEditor
          label="Height"
          value={position.height}
          units={position.height_units}
          onValueChange={(height) => updatePosition({ height })}
          onUnitsChange={(height_units) => updatePosition({ height_units })}
        />
      </TwoUpCollapsableGrid>
      {isFreeLayout && <SnapPaneMenu {...{ updatePosition }} />}

      <Divider size="M" marginY="size-150" />
      <Text >Padding</Text>
      <TwoUpCollapsableGrid>
        <PositionUnitEditor
          label="Top"
          value={position.pad_top}
          units={position.pad_units_top}
          onValueChange={(pad_top) => updatePosition({ pad_top })}
          onUnitsChange={(pad_units_top) => updatePosition({ pad_units_top })}
        />
        <PositionUnitEditor
          label="Bottom"
          value={position.pad_bottom}
          units={position.pad_units_bottom}
          onValueChange={(pad_bottom) => updatePosition({ pad_bottom })}
          onUnitsChange={(pad_units_bottom) => updatePosition({ pad_units_bottom })}
        />
      </TwoUpCollapsableGrid>
      <TwoUpCollapsableGrid>
        <PositionUnitEditor
          label="Left"
          value={position.pad_left}
          units={position.pad_units_left}
          onValueChange={(pad_left) => updatePosition({ pad_left })}
          onUnitsChange={(pad_units_left) => updatePosition({ pad_units_left })}
        />
        <PositionUnitEditor
          label="Right"
          value={position.pad_right}
          units={position.pad_units_right}
          onValueChange={(pad_right) => updatePosition({ pad_right })}
          onUnitsChange={(pad_units_right) => updatePosition({ pad_units_right })}
        />
      </TwoUpCollapsableGrid>
    </Flex>
  );
};
