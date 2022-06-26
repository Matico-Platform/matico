import _ from "lodash";
import { useRef, useEffect } from "react";
import { registerOrUpdateDataset } from "../Stores/MaticoDatasetSlice";
import { useMaticoDispatch } from "./redux";
import { useAppSpec } from "./useAppSpec";
import { useNormalizeSpec } from "./useNormalizeSpec";
import {Dataset as DatasetSpec} from '@maticoapp/matico_types/spec'

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

    // console.log("normalizedDatasetSpec is ", normalizedDatasetSpec, spec?.datasets)

    const previousDatasetSpec = useRef<Array<DatasetSpec>>([]);

    useEffect(() => {
        if (!normalizedDatasetSpec) {
            return;
        }
        // If the full normalized spec is the same as the previous one, simply return
        if (_.isEqual(normalizedDatasetSpec, previousDatasetSpec.current)) {
            return;
        }
        normalizedDatasetSpec.forEach(
            (datasetDetails: DatasetSpec) => {
                const prevSpec =previousDatasetSpec.current.find((d: DatasetSpec) => d.name === datasetDetails.name);

                // Skip if this particular dataset needs no update
                if (prevSpec && _.isEqual(prevSpec, datasetDetails)) {
                //   console.log("skipping ",details.name)
                    return;
                }
                // console.log("updating ",details.name)

                dispatch(
                    registerOrUpdateDataset({
                        ...datasetDetails
                    })
                );
            }
        );
        previousDatasetSpec.current = normalizedDatasetSpec;
    }, [normalizedDatasetSpec, previousDatasetSpec]);
};
