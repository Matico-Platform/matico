import _ from "lodash";
import { useRef, useEffect } from "react";
import { registerOrUpdateDataset } from "../Stores/MaticoDatasetSlice";
import { useMaticoDispatch } from "./redux";
import { useAppSpec } from "./useAppSpec";
import { useNormalizeSpec } from "./useNormalizeSpec";

/**
 * Registers and keeps datasets in sync with the specification
 * Will denormalize variables and data properties and then rerun the
 * required datasets
 */
export const useRegisterDatasets = () => {
    const spec = useAppSpec();
    const dispatch = useMaticoDispatch();

    const [normalizedDatasetSpec, loadingDatasetSpec, datasetSpecError] =
        useNormalizeSpec(spec?.datasets);

    console.log("normalizedDatasetSpec is ", normalizedDatasetSpec, spec?.datasets)

    const previousDatasetSpec = useRef<Record<string, any>>([]);

    useEffect(() => {
        if (!normalizedDatasetSpec) {
            return;
        }
        // If the full normalized spec is the same as the previous one, simply return
        if (_.isEqual(normalizedDatasetSpec, previousDatasetSpec.current)) {
            return;
        }
        normalizedDatasetSpec.forEach(
            (datasetDetails: { [type: string]: any }) => {
                const [type, details] = Object.entries(datasetDetails)[0];
                const prevSpec =previousDatasetSpec.current.find((d: Record<string,any>) => Object.values(d)[0].name === details.name);


                // Skip if this particular dataset needs no update
                if (prevSpec && _.isEqual(Object.values(prevSpec)[0], details)) {
                  console.log("skipping ",details.name)
                    return;
                }
                console.log("updating ",details.name)

                dispatch(
                    registerOrUpdateDataset({
                        ...details,
                        type
                    })
                );
            }
        );
        previousDatasetSpec.current = normalizedDatasetSpec;
    }, [normalizedDatasetSpec, previousDatasetSpec]);
};
