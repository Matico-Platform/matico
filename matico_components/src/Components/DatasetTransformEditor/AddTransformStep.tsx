import React from "react";
import {
    DialogTrigger,
    ActionButton,
    Dialog,
    Heading,
    Content,
    repeat
} from "@adobe/react-spectrum";
// @ts-ignore
import { DatasetTransformStep } from "@maticoapp/matico_types/spec";
import { DefaultGrid } from "Components/DefaultGrid/DefaultGrid";
import Filter from "@spectrum-icons/workflow/Filter";
import Join from "@spectrum-icons/workflow/Merge";
import AggregateIcon from "@spectrum-icons/workflow/GraphBarHorizontal";
import Column from "@spectrum-icons/workflow/ColumnSettings";
import Compute from "@spectrum-icons/workflow/Calculator";
import Add from "@spectrum-icons/workflow/Add";

export const AddTransformStepDialog: React.FC<{
    onAdd: (type: DatasetTransformStep) => void;
    useIcon?: boolean;
}> = ({ onAdd, useIcon }) => {
    const addFilter = (close: () => void) => {
        onAdd({
            type: "filter",
            filters: []
        });
        close();
    };

    const addAggregate = (close: () => void) => {
        onAdd({
            type: "aggregate",
            aggregate: [],
            groupByColumns: []
        } as DatasetTransformStep);
        close();
    };

    const addCompute = (close: () => void) => {
        onAdd({
            type: "compute",
            url: null
        } as DatasetTransformStep);
        close();
    };
    const addColumnTransform = (close: () => void) => {
        onAdd({
            type: "columnTransform",
            transforms: []
        } as DatasetTransformStep);
        close();
    };

    const addJoin = (close: () => void) => {
        onAdd({
            type: "join",
            otherSourceId: null,
            joinType: "inner",
            joinColumnsLeft: [],
            joinColumnsRight: [],
            leftPrefix: "",
            rightPrefix: ""
        } as DatasetTransformStep);
        close();
    };

    return (
        <DialogTrigger isDismissable type="popover">
            <ActionButton isQuiet aria-label="Add Transform Step">
                {useIcon ? <Add size="S" /> : "Add Transform step"}
            </ActionButton>
            {(close) => (
                <Dialog>
                    <Heading>Step Type</Heading>
                    <Content>
                        <DefaultGrid
                            columns={repeat(2, "1fr")}
                            columnGap={"size-150"}
                            rowGap={"size-150"}
                            autoRows="fit-content"
                            marginBottom="size-200"
                        >
                            <ActionButton onPress={() => addFilter(close)}>
                                <Filter />
                                Filter
                            </ActionButton>
                            <ActionButton onPress={() => addAggregate(close)}>
                                <AggregateIcon />
                                Aggregate
                            </ActionButton>
                            <ActionButton onPress={() => addCompute(close)}>
                                <Compute />
                                Compute
                            </ActionButton>
                            <ActionButton onPress={() => addJoin(close)}>
                                <Join />
                                Join
                            </ActionButton>
                            <ActionButton
                                onPress={() => addColumnTransform(close)}
                            >
                                <Column />
                                Column Transform
                            </ActionButton>
                        </DefaultGrid>
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};
