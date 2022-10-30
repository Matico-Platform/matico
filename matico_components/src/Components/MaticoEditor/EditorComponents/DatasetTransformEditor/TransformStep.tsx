
import { TransformStepProps } from "./types";
import { DatasetTransformStep } from "@maticoapp/matico_types/spec";
import React from "react";
import { JoinStepEditor } from "./JoinStep";
import { AggregateStepEditor } from "./AggregateStep";
import { FilterStepEditor } from "./FilterStep";
import { ColumnTransformStepEditor } from "./ColumnTransfomStepEditor";
import { Text } from "@adobe/react-spectrum";

export const TransformStep: React.FC<TransformStepProps> = ({
    step,
    datasetId,
    onChange,
    columns
}) => {
    const updateStep = (update: Partial<DatasetTransformStep>) => {
        onChange({ ...step, ...update });
    };

    switch (step.type) {
        case "filter":
            return (
                <FilterStepEditor
                    filterStep={step}
                    onChange={updateStep}
                    datasetId={datasetId}
                    columns={columns}
                />
            );
        case "join":
            return (
                <JoinStepEditor
                    joinStep={step}
                    onChange={updateStep}
                    datasetId={datasetId}
                    columns={columns}
                />
            );
        case "aggregate":
            return (
                <AggregateStepEditor
                    step={step}
                    onChange={updateStep}
                    datasetId={datasetId}
                    columns={columns}
                />
            );
            // @ts-ignore NYI
        case "columnTransform":
            return (
                <ColumnTransformStepEditor
                    step={step}
                    onChange={updateStep}
                    datasetId={datasetId}
                    columns={columns}
                />
            );
        case "compute":
            return <Text>Compute not implemented</Text>;
        default:
            return <Text> Not Implemented</Text>;
    }
};