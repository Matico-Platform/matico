import React from "react";
import {
    View,
    Header,
    Flex,
    Slider,
    NumberField,
    ToggleButton
} from "@adobe/react-spectrum";
import { useMaticoSelector } from "Hooks/redux";
import FunctionIcon from "@spectrum-icons/workflow/Function";
import _ from "lodash";
import { DataDrivenModal } from "./DataDrivenModal";
import { MappingVarOr } from "@maticoapp/matico_types/spec";

export interface NumericVariableEditorProps {
    style: MappingVarOr<number>;
    label: string;
    onUpdateStyle: (style: MappingVarOr<number>) => void;
    datasetName?: string;
    minVal: number;
    maxVal: number;
    showDataDriven?: boolean;
}

export const NumericVariableEditor: React.FC<NumericVariableEditorProps> = ({
    style,
    minVal,
    maxVal,
    label,
    onUpdateStyle,
    datasetName,
    showDataDriven = true
}) => {
    const dataset = useMaticoSelector(
        (state) => state.datasets.datasets[datasetName]
    );

    const isDataDriven = style && style.hasOwnProperty("variable");

    const toggleDataDriven = () => {
        const defaultColumn = dataset?.columns[0];

        if (isDataDriven) {
            onUpdateStyle((minVal + maxVal) * 0.5);
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
                range: _.range(5).map(
                    (i) => minVal + ((maxVal - minVal) * i) / 5.0
                )
            });
        }
    };

    return (
        <View>
            <Header>{label}</Header>
            <Flex
                direction="row"
                gap="size-125"
                alignItems="start"
                justifyContent="space-between"
            >
                {isDataDriven ? (
                    <DataDrivenModal
                        rangeType="value"
                        datasetName={datasetName}
                        spec={style}
                        label={`Styling using ${style.variable}`}
                        onUpdateSpec={(newSpec) => {
                            onUpdateStyle(newSpec);
                        }}
                    />
                ) : (
                    <>
                        <Slider
                            value={style}
                            onChange={(val) => onUpdateStyle(val)}
                            flex={1}
                            maxValue={maxVal}
                            minValue={minVal}
                            showValueLabel={false}
                        />
                        <NumberField
                            value={style}
                            width="size-1200"
                            maxValue={maxVal}
                            minValue={minVal}
                            onChange={(val) => onUpdateStyle(val)}
                        />
                    </>
                )}
                {showDataDriven && (
                    <ToggleButton
                        isEmphasized
                        onPress={toggleDataDriven}
                        isSelected={isDataDriven}
                    >
                        <FunctionIcon />
                    </ToggleButton>
                )}
            </Flex>
        </View>
    );
};
