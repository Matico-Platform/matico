import { Box, Form, FormField, Grid, TextInput } from "grommet";
import React from "react";
import { MaticoPaneInterface } from "../Panes/Pane";

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
    const newPos = {
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
      name: change.name,
    });
  };

  return (
    <Box background={"white"}>
      <Form value={position} onChange={(nextVal) => updatePosition(nextVal)}>
        <FormField label="name" name="name" htmlFor={"name"} gridArea={"name"}>
          <TextInput value={name} name="name" id="name" textAlign="center" />
        </FormField>
        <Grid
          columns={{ count: 2, size: "auto" }}
          gap="medium"
          areas={[
            ["x", "y"],
            ["width", "height"],
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
        </Grid>
      </Form>
      Form
    </Box>
  );
};
