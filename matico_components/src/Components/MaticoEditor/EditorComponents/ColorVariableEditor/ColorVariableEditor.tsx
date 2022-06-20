import React from "react";
import { ColorVariableEditorProps } from "./types";
import _ from "lodash";
import {
  Flex,
  Item,
  Text,
  Section,
  ComboBox,
} from "@adobe/react-spectrum";
import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle';
import ColorFill from '@spectrum-icons/workflow/ColorFill';
import Abc from '@spectrum-icons/workflow/ABC';
import OneTwoThree from '@spectrum-icons/workflow/123';
import { TwoUpCollapsableGrid } from "Components/MaticoEditor/Utils/TwoUpCollapsableGrid";
import { DataDrivenModal } from "Components/MaticoEditor/Utils/DataDrivenModal";
import { ColorPickerDialog } from "Components/MaticoEditor/Utils/ColorPickerDialog";


export const ColorVariableEditor: React.FC<ColorVariableEditorProps> = ({
  label,
  style,
  datasetName,
  columns,
  onUpdateStyle,
}) => {

  const isDataDriven = style.hasOwnProperty("variable");
  const isNoColor = !isDataDriven && JSON.stringify(style) === '[0,0,0,0]'
  const isManual = (!isDataDriven && !isNoColor) && (typeof style === 'string' || Array.isArray(style))

  const handleComboBoxChange = (newVal: string) => {
    if (newVal === "manualColor") {
      onUpdateStyle(isManual ? style : [120, 120, 255]);
    } else if (newVal === "noColor") {
      onUpdateStyle([0, 0, 0, 0]);
    } else if (newVal.includes("datadriven-")) {
      const selectedColumn = newVal.split("datadriven-")[1]
      onUpdateStyle({
        variable: selectedColumn,
        domain: {
          dataset: datasetName,
          column: selectedColumn,
          metric: {
            Quantile: {
              bins: 5
            }
          }
        },
        range: "RedOr.5"
      });
    }
  }

  return (
    <TwoUpCollapsableGrid
      gridProps={{
        alignItems: "end"
      }}
    >
      <ComboBox
        onSelectionChange={handleComboBoxChange}
        label={label}
        width="100%"
        // @ts-ignore
        defaultInputValue={isDataDriven ? style?.variable : isNoColor ? "No Color" : isManual ? "Select Color" : ""}
      >
        <Section title="Manual">
          <Item textValue="Select Color" key="manualColor">
            <Flex gridArea={"text"} alignItems="center" gap=".25em">
              <ColorFill size="S" />
              <Text flexGrow={1}>
                Select Color
              </Text>
            </Flex>
          </Item>
          <Item textValue="No Color" key="noColor">
            <Flex gridArea={"text"} alignItems="center" gap=".25em">
              <RemoveCircle size="S" />
              <Text flexGrow={1}>
                No Color
              </Text>
            </Flex>
          </Item>
        </Section>
        <Section title="Data Driven">
          {columns.map(({ name, type }, i) => (
            <Item key={`datadriven-${name}`} textValue={name}>
              <Flex gridArea={"text"} alignItems="center" gap=".25em">
                {type === "number" ? <OneTwoThree size="S" /> : <Abc size="S" />}
                <Text flexGrow={1}>
                  {name}
                </Text>
              </Flex>
            </Item>
          ))}
        </Section>
      </ComboBox>
      {!!isDataDriven && (
        <DataDrivenModal
          rangeType="color"
          datasetName={datasetName}
          spec={style}
          // @ts-ignore
          label={`Advanced Styling`}
          onUpdateSpec={(newSpec) => {
            onUpdateStyle(newSpec);
          }}
        />
      )}
      {!!isManual && (
        <ColorPickerDialog
          // @ts-ignore
          color={style}
          onColorChange={(color) => onUpdateStyle(color)}
        />
      )}
    </TwoUpCollapsableGrid>
  )
}