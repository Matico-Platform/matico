import { Flex, ToggleButton, View, Header, Text } from "@adobe/react-spectrum";
import { useMaticoSelector } from "Hooks/redux";
import React from "react";
import { ColorPickerDialog } from "./ColorPickerDialog";
import { DataDrivenModal } from "./DataDrivenModal";
import FunctionIcon from "@spectrum-icons/workflow/Function";

interface ColorVariableEditorProps {
    style: any;
    label: string;
    onUpdateStyle: (style: any) => void;
    datasetName?: string;
}

export const ColorVariableEditor: React.FC<ColorVariableEditorProps> = ({
    style,
    onUpdateStyle,
    datasetName,
    label
}) => {
    const dataset = useMaticoSelector(
        (state) => state.datasets.datasets[datasetName]
    );

    const defaultColumn = dataset?.columns[0];

    const isDataDriven = style.hasOwnProperty("variable");
    const toggleDataDriven = () => {
        if (isDataDriven) {
            onUpdateStyle([255, 255, 0]);
        } else {
            onUpdateStyle({
                variable: defaultColumn.name,
                domain: {
                    dataset: datasetName,
                    column: defaultColumn.name,
                    metric: {
                        type: "quantile",
                        bins: 5
                    }
                },
                range: "RedOr.5"
            });
        }
    };

    return (
        <View>
            <Header>{label}</Header>
            <Flex direction="row" justifyContent="space-between">
                {style.hasOwnProperty("variable") ? (
                    <DataDrivenModal
                        rangeType="color"
                        datasetName={datasetName}
                        spec={style}
                        label={`Styling using ${style.variable}`}
                        onUpdateSpec={(newSpec) => {
                            onUpdateStyle(newSpec);
                        }}
                    />
                ) : (
                    <ColorPickerDialog
                        color={style}
                        onColorChange={(color) => onUpdateStyle(color)}
                    />
                )}
                <ToggleButton
                    isEmphasized
                    onPress={toggleDataDriven}
                    isSelected={isDataDriven}
                >
                    <FunctionIcon />
                </ToggleButton>
            </Flex>
        </View>
    );
};
