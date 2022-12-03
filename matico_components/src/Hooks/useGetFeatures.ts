import { useMemo } from "react";
//@ts-ignore
import { v4 as uuid } from "uuid";
import { useEffect } from "react";
import {
    requestFeatures,
    FeatureRequest as FeatureRequestSpec
} from "Stores/MaticoDatasetSlice";
import { useMaticoDispatch, useMaticoSelector } from "./redux";

export const useGetFeatures = (featureRequest: FeatureRequestSpec) => {
    const dispatch = useMaticoDispatch();
    const notifierId = useMemo(() => uuid(), [JSON.stringify(featureRequest)]);

    const result = useMaticoSelector(
        (selector) => selector.datasets.queries[notifierId]
    );

    useEffect(() => {
        dispatch(
            requestFeatures({
                notifierId,
                args: featureRequest
            })
        );
    }, [notifierId]);

    return result;
};
