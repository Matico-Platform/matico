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
  style = { rgb: [255, 255, 255] },
  datasetName,
  columns,
  onUpdateStyle,
}) => {
  const isDataDriven = style && style.hasOwnProperty("variable");
  const isNone = !isDataDriven && '[[0, 0, 0, 0]]' === JSON.stringify(Object.values(style))
  const isManual = !isDataDriven && !isNone

  const handleComboBoxChange = (newVal: string) => {
    if (newVal === `manual${label}`) {
      onUpdateStyle(isManual ? style : { 'rgba': [120, 120, 255, 255] });
    } else if (newVal === `no${label}`) {
      onUpdateStyle({ 'rgba': [0, 0, 0, 0] });
    } else if (newVal.includes("datadriven-")) {
      const selectedColumn = newVal.split("datadriven-")[1]
      onUpdateStyle({
        variable: selectedColumn,
        domain: {
          dataset: datasetName,
          column: selectedColumn,
          metric: {
            type: "quantile",
            bins: 5
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