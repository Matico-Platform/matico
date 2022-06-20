import React from "react";
import { ColorVariableEditorProps } from "./types";
import _ from "lodash";
import { TwoUpCollapsableGrid } from "Components/MaticoEditor/Utils/TwoUpCollapsableGrid";
import { DataDrivenModal } from "Components/MaticoEditor/Utils/DataDrivenModal";
import { ColorPickerDialog } from "Components/MaticoEditor/Utils/ColorPickerDialog";
import { ManualVariableComboBox } from "../ManualVariableComboBox";
import ColorFill from "@spectrum-icons/workflow/ColorFill";

export const ColorVariableEditor: React.FC<ColorVariableEditorProps> = ({
  label,
  style=[255,255,255],
  datasetName,
  columns,
  onUpdateStyle,
}) => {
  console.log(style)
  const isDataDriven = style && style.hasOwnProperty("variable");
  const isNone = !isDataDriven && JSON.stringify(style) === '[0,0,0,0]'
  const isManual = (!isDataDriven && !isNone) && (typeof style === 'string' || Array.isArray(style))

  const handleComboBoxChange = (newVal: string) => {
    console.log(newVal)
    if (newVal === `manual${label}`) {
      onUpdateStyle(isManual ? style : [120, 120, 255]);
    } else if (newVal === `no${label}`) {
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
      <ManualVariableComboBox
        label={label}
        columns={columns}
        style={style}
        onChange={handleComboBoxChange}
        manualIcon={<ColorFill size="S" />}
        isManual={isManual}
        isDataDriven={isDataDriven}
        isNone={isNone}
      />

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