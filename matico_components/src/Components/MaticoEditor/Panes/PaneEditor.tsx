import {
  Box,
  Form,
  FormField,
  Grid,
  RadioButton,
  RadioButtonGroup,
  TextInput,
} from "grommet";
import React from "react";
import { MaticoPaneInterface } from "Components/Panes/Pane";

interface PaneEditorProps extends MaticoPaneInterface {
  onChange: (update: MaticoPaneInterface) => void;
}

export const PaneEditor: React.FC<PaneEditorProps> = ({
  position,
  background,
  onChange,
  name,
}) => {
  const updatePosition = (change: any) => {
    console.log("Name ", change);
    const newPos = {
      ...change,
      x: parseInt(change.x),
      y: parseInt(change.y),
      width: parseInt(change.width),
      height: parseInt(change.height),
    };
    // TODO make rust emmit interfaces + classes with the intrfaces lacking things like free
    onChange({
      background,
      //@ts-ignore
      position: { ...position, ...newPos },
      name: change.name || name,
    });
  };
  console.log("position ", position)

  return (
    <Box background={"white"} width="100%" height="100%">
      <Form value={position} onChange={(nextVal) => updatePosition(nextVal)} widht="100%" height="100%">
        <FormField label="name" name="name" htmlFor={"name"} gridArea={"name"}>
          <TextInput value={name} name="name" id="name" textAlign="center" />
        </FormField>
        <Grid
          columns={["100px","100px","0.5fr","100px","100px"]}
          areas={[
            // ["x",  "y"],
            // ["x_units", 'y_units'],
            // ["width", "height"], 
            // ["width_units","height_units"]
            ["x", "x_units","gap","y","y_units"],
            ["width", "width_units","gap","height", "height_units"],
          ]}
        >
          <FormField label="x" name="x" htmlFor={"x"} gridArea={"x"}>
            <TextInput
              type="number"
              value={position.x}
              name="x"
              id="x"
              textAlign="center"
            />
          </FormField>
          <FormField
            name="x_units"
            htmlFor={"x_units"}
            gridArea={"x_units"}
            style={{alignSelf:"end"}}
          >
            <RadioButtonGroup
              direction="row"
              name="x_units"
              id="x_units"
              options={[
                { label: "px", value: "Pixels" },
                { label: "%", value: "Percent" },
              ]}
              value={position.x_units ?? "Pixels"}
            />
          </FormField>
          <FormField label="y" name="y" htmlFor="y" gridArea={"y"}>
            <TextInput
              type="number"
              value={position.y}
              name="y"
              id={"y"}
              textAlign="center"
            />
          </FormField>
          <FormField
            name="y_units"
            htmlFor={"y_units"}
            gridArea={"y_units"}
            style={{alignSelf:"end"}}
          >
            <RadioButtonGroup
              direction="row"
              name="y_units"
              id="y_units"
              options={[
                { label: "px", value: "Pixels" },
                { label: "%", value: "Percent" },
              ]}
              value={position.y_units ?? "Pixels"}
            />
          </FormField>
          <FormField
            label="width"
            name="width"
            htmlFor="width"
            gridArea={"width"}
          >
            <TextInput
              type="number"
              value={position.width}
              id={"width"}
              name="width"
              textAlign="center"
            />
          </FormField>
          <FormField
            name="width_units"
            htmlFor={"width_units"}
            gridArea={"width_units"}
            style={{alignSelf:"end"}}
          >
            <RadioButtonGroup
              direction="row"
              id="width_units"
              name="width_units"
              options={[
                { label: "px", value: "Pixels" },
                { label: "%", value: "Percent" },
              ]}
              value={position.width_units ?? "Pixels"}
            />
          </FormField>
          <FormField
            label="height"
            name="height"
            htmlFor="height"
            gridArea={"height"}
          >
            <TextInput
              type="number"
              value={position.height}
              id={"height"}
              name="height"
              textAlign="center"
            />
          </FormField>

          <FormField
            name="height_units"
            htmlFor={"height_units"}
            gridArea={"height_units"}
            style={{alignSelf:"end"}}
          >
            <RadioButtonGroup
              direction="row"
              name="height_units"
              id="height_units"
              options={[
                { label: "px", value: "Pixels" },
                { label: "%", value: "Percent" },
              ]}
              value={position.height_units ?? "Pixels"}
            />
          </FormField>
        </Grid>
      </Form>
    </Box>
  );
};
