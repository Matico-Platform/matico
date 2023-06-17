import React from "react";
import {
  Picker,
  Item,
  Radio,
  RadioGroup,
  Flex
} from "@adobe/react-spectrum";

import {
  LinearLayout,
  LinearLayoutDirection,
  Alignment,
  Justification
} from "@maticoapp/matico_types/spec";

export interface LinearLayoutEditorProps {
  layout: LinearLayout;
  onChange: (update: Partial<Layout>) => void
}

export const LinearLayoutEditor: React.FC<LinearLayoutEditorProps> = ({
  layout,
  onChange
}) => {

  return (
    <Flex direction="column" rowGap="size-300" marginTop="size-300">
      <RadioGroup
        label="Flow direction"
        value={layout.direction}
        onChange={(val) =>
          onChange({ direction: val as LinearLayoutDirection })
        }
      >
        <Flex direction="row">
          <Radio value="row">Horizontal</Radio>
          <Radio value="column">Vertical</Radio>
        </Flex>
      </RadioGroup>
      <RadioGroup
        label="Fit content to container"
        value={layout.allowOverflow ? "allow" : "noAllow"}
        onChange={(stringVal) =>
          onChange({
            allowOverflow: stringVal === "allow" ? true : false
          })
        }
      >
        <Flex direction="row">
          <Radio value={"allow"}>Overflow content</Radio>
          <Radio value={"noAllow"}>Fit to container</Radio>
        </Flex>
      </RadioGroup>

      <Picker
        label="Gap"
        width={"100%"}
        selectedKey={layout?.gap ?? "none"}
        onSelectionChange={(gap) => onChange({ gap })}
        items={[
          { id: "none", label: "None" },
          { id: "small", label: "Small" },
          { id: "medium", label: "Medium" },
          { id: "large", label: "Large" }
        ]}
      >
        {(item) => <Item key={item.id}>{item.label}</Item>}
      </Picker>
      {!layout.allowOverflow && (
        <>
          <RadioGroup
            label="Flow Alignment"
            value={layout.align}
            onChange={(val) =>
              onChange({ align: val as Alignment })
            }
          >
            <Flex direction="row" wrap={"wrap"}>
              <Radio value="start">Start</Radio>
              <Radio value="center">Center</Radio>
              <Radio value="end">End</Radio>
              <Radio value="stretch">Stretch</Radio>
              <Radio value="baseline">Baseline</Radio>
            </Flex>
          </RadioGroup>

          <RadioGroup
            label="Flow Justification"
            value={layout.justify}
            onChange={(val) =>
              onChange({ justify: val as Justification })
            }
          >
            <Flex direction="row" wrap={"wrap"}>
              <Radio value="start">Start</Radio>
              <Radio value="center">Center</Radio>
              <Radio value="end">End</Radio>
              <Radio value="space-between">Space Between</Radio>
              <Radio value="space-around">Space Around</Radio>
              <Radio value="space-evenly">Space Evenly</Radio>
            </Flex>
          </RadioGroup>
        </>
      )}
    </Flex>
  );
};

