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

    const previousDatasetSpec = useRef<Record<string, any>>({});

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
                const prevSpec = Object.values(
                    previousDatasetSpec.current
                ).find((d) => d.name === details.name);

                // Skip if this particular dataset needs no update
                if (_.isEqual(prevSpec, details)) {
                    return;
                }

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
