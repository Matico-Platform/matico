import { DatasetTransform as DatasetTransformSpec } from "@maticoapp/matico_types/spec";
import { DatasetTransform } from "Datasets/DatasetTransform";
import { useEffect } from "react";
import { requestTransform } from "Stores/MaticoDatasetSlice";
import { useMaticoDispatch, useMaticoSelector } from "./redux";
import { useRequestData } from "./useRequestData";

export const useTransform = (transform: DatasetTransformSpec) => {
    const transformResult = useMaticoSelector(
        (selector) => selector.datasets.transforms[transform.id]
    );
    const dispatch = useMaticoDispatch();

    useEffect(() => {
        dispatch(requestTransform(transform));
    }, [transform]);
    return transformResult;
};

export const useTemporaryTransform = (transfrom: DatasetTransformSpec) => {
    const baseDataset = useRequestData({
        datasetName: transfrom.sourceId,
        notifierId: `${transfrom.id}_temp`
    });
    const transformer = new DatasetTransform(transfrom);
};
