import {
    DatasetTransform,
    DatasetTransformStep,
    Layer,
    Pane
} from "@maticoapp/matico_types/spec";
import {
    updateDatasetTransform,
    updateDatasetTransformStep,
    removeDatasetTransformStep,
    addDatasetTransformStep
} from "Stores/MaticoSpecSlice";

import { useMaticoDispatch, useMaticoSelector } from "./redux";
import _ from "lodash";
import {v4 as uuid} from 'uuid'

export const useDatasetTransform = (datasetTransformId: string) => {
    const datasetTransform = useMaticoSelector((selector) =>
        selector.spec.spec.datasetTransforms.find(
            (dt: DatasetTransform) => dt.id === datasetTransformId
        )
    );

    const source = useMaticoSelector((selector) =>
        selector.spec.spec.datasets.find(
            (d) =>
                d.id === datasetTransform.sourceId ??
                selector.spec.spec.datasetTransforms.find(
                    (d) => d.id === datasetTransform.sourceId
                )
        )
    );

    const dispatch = useMaticoDispatch();

    const _updateDatasetTransform = (update: Partial<DatasetTransform>) => {
        dispatch(updateDatasetTransform(update));
    };

    const _updateStep = (
        update: Partial<DatasetTransformStep>
    ) => {
        dispatch(
            updateDatasetTransformStep({
                transformId: datasetTransform.id,
                update
            })
        );
    };

    const _removeStep = (stepId: string) => {
        console.log("removing step ", stepId)
        dispatch(
            removeDatasetTransformStep({
                transformId: datasetTransform.id,
                stepId
            })
        );
    };

    const _addStep = (step: DatasetTransformStep) => {
        dispatch(
            addDatasetTransformStep({ transformId: datasetTransform.id, step:{id: uuid(), ...step }})
        );
    };

    return {
        datasetTransform,
        source,
        updateDatasetTransform: _updateDatasetTransform,
        addStep: _addStep,
        removeStep: _removeStep,
        updateStep: _updateStep
    };
};
