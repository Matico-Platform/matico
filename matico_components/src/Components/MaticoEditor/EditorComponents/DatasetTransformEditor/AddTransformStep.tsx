import React from 'react'
import {DialogTrigger, ActionButton, Dialog, Heading, Content,  repeat} from '@adobe/react-spectrum';
import {DatasetTransformStep} from '@maticoapp/matico_types/spec';
import {DefaultGrid} from 'Components/MaticoEditor/Utils/DefaultGrid';
import Filter from "@spectrum-icons/workflow/Filter"
import Join from "@spectrum-icons/workflow/Merge";
import AggregateIcon from "@spectrum-icons/workflow/GraphBarHorizontal";
import Compute from "@spectrum-icons/workflow/Calculator";

export const AddTransformStepDialog: React.FC<{
    onAdd: (type: DatasetTransformStep) => void;
}> = ({ onAdd }) => {
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

    const addJoin = (close: () => void) => {
        onAdd({
            type: "join",
            otherSourceId: null,
            joinType: "inner",
            joinColumnsLeft: [],
            joinColumnsRight: [],
            leftPrefix:"",
            rightPrefix:""
        } as DatasetTransformStep);
        close();
    };

    return (
        <DialogTrigger isDismissable type="popover">
            <ActionButton isQuiet>Add Transform step</ActionButton>
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
                        </DefaultGrid>
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};
