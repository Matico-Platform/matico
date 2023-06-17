import React from "react";
import { SliderVariableEditorProps } from "./types";
import _ from "lodash";
import { TwoUpCollapsableGrid } from "Components/TwoUpCollapsableGrid/TwoUpCollapsableGrid";
import { DataDrivenModal } from "Components/DataDrivenModal/DataDrivenModal";
import { ManualVariableComboBox } from "../ManualVariableComboBox";
import ColorFill from "@spectrum-icons/workflow/ColorFill";
import { SliderUnitSelector } from "../SliderUnitSelector";

export const SliderVariableEditor: React.FC<SliderVariableEditorProps> = ({
    label = "",
    style,
    datasetName,
    columns,
    sliderMin = 0,
    sliderMax = 2000,
    sliderStep = 1,
    onUpdateValue,
    sliderUnits,
    sliderUnitsOptions,
    onUpdateUnits
}) => {
    const nullValue = -1;
    const isDataDriven = style.hasOwnProperty("variable");
    const isNone = !isDataDriven && style === nullValue;
    const isManual = !isDataDriven && !isNone;

    const handleComboBoxChange = (newVal: string) => {
        if (newVal === `manual${label}`) {
            onUpdateValue(isManual ? style : 5);
        } else if (newVal === `no${label}`) {
            onUpdateValue(nullValue);
        } else if (newVal.includes("datadriven-")) {
            const selectedColumn = newVal.split("datadriven-")[1];
            onUpdateValue({
                variable: selectedColumn,
                domain: {
                    dataset: datasetName,
                    column: selectedColumn,
                    metric: {
                        type: "quantile",
                        bins: 5
                    }
                },
                range: _.range(5).map(
                    (i) => sliderMin + ((sliderMax - sliderMin) * i) / 5.0
                )
            });
        }
    };

    return (
        <TwoUpCollapsableGrid
            gridProps={{
                alignItems: "end"
            }}
        >
            <ManualVariableComboBox
                label={label}
                columns={columns}
                onChange={handleComboBoxChange}
                style={style}
                manualIcon={<ColorFill size="S" />}
                isManual={isManual}
                isDataDriven={isDataDriven}
                isNone={isNone}
            />

            {!!isDataDriven && (
                <DataDrivenModal
                    rangeType="value"
                    datasetName={datasetName}
                    spec={style}
                    // @ts-ignore
                    label={`Advanced Styling`}
                    onUpdateSpec={(newSpec) => {
                        onUpdateValue(newSpec);
                    }}
                />
            )}
            {!!isManual && typeof style === "number" && (
                <SliderUnitSelector
                    label={label}
                    value={style}
                    sliderMin={sliderMin}
                    sliderMax={sliderMax}
                    sliderStep={sliderStep}
                    onUpdateValue={onUpdateValue}
                    sliderUnits={sliderUnits}
                    sliderUnitsOptions={sliderUnitsOptions}
                    onUpdateUnits={onUpdateUnits}
                />
            )}
        </TwoUpCollapsableGrid>
    );
};
