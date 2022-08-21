import _ from "lodash";
import { useRef, useEffect } from "react";
import { registerOrUpdateDataset, registerOrUpdateTransform, unregisterDataset } from "../Stores/MaticoDatasetSlice";
import { useMaticoDispatch, useMaticoSelector } from "./redux";
import { Dataset as DatasetSpec, DatasetTransform } from "@maticoapp/matico_types/spec";
import { useErrorsOfType} from "./useErrors";
import {MaticoErrorType} from "Stores/MaticoErrorSlice";
import {useNormalizedSpecSelector} from "./useNormalizedSpecSelector";

/**
 * Registers and keeps datasets in sync with the specification
 * Will denormalize variables and data properties and then rerun the
 * required datasets
 */
export const useRegisterDatasets = () => {
    const datasets = useNormalizedSpecSelector(s=>s?.datasets) ?? []
    const dispatch = useMaticoDispatch();
    const {clearErrors, throwError} = useErrorsOfType(MaticoErrorType.DatasetError);
  

    useEffect(()=>{
      Object.entries(datasets).forEach( ([id,details])=>{
        if(details.error){
          throwError({
            id: id,
            message: details.error,
          })
        }
      })
    },[datasets])

    const normalizedDatasetSpec =useNormalizedSpecSelector((spec)=>spec?.datasets)
    const normalizedDatasetTransforms =useNormalizedSpecSelector((spec)=>spec?.datasetTransforms)

    const previousDatasetSpec = useRef<Array<DatasetSpec>>([]);
    const previousTransforms= useRef<Array<DatasetTransform>>([]);


    useEffect(() => {
        if (!normalizedDatasetSpec) {
            return;
        }
        // If the full normalized spec is the same as the previous one, simply return
        if (_.isEqual(normalizedDatasetSpec, previousDatasetSpec.current)) {
            return;
        }
        normalizedDatasetSpec.forEach((datasetDetails: DatasetSpec) => {
            clearErrors()
            const prevSpec = previousDatasetSpec.current.find(
                (d: DatasetSpec) => d.name === datasetDetails.name
            );

            // Skip if this particular dataset needs no update
            if (prevSpec && _.isEqual(prevSpec, datasetDetails)) {
                return;
            }

            dispatch(
                registerOrUpdateDataset({
                    ...datasetDetails
                })
            );
        });

        // REMOVE ANY DATASETS THAT HAVE DISSAPEARED FROM THE LAST TIME 
        previousDatasetSpec.current.forEach((datasetDetails: DatasetSpec)=>{
          const currentSpec = normalizedDatasetSpec.find(d=>d.name ===datasetDetails.name)
          if(!currentSpec){
            dispatch(
              unregisterDataset({
                ...datasetDetails 
              })
            )
          }
        })
        previousDatasetSpec.current = normalizedDatasetSpec;
    }, [normalizedDatasetSpec, previousDatasetSpec]);


    useEffect(() => {
        if (!normalizedDatasetTransforms) {
            return;
        }
        // If the full normalized spec is the same as the previous one, simply return
        if (_.isEqual(normalizedDatasetTransforms, previousTransforms.current)) {
            return;
        }
        normalizedDatasetTransforms.forEach((transformDetails: DatasetTransform) => {
            clearErrors()
            const prevSpec = previousTransforms.current.find(
                (d: DatasetTransform) => d.name === transformDetails.name
            );

            // Skip if this particular dataset needs no update
            if (prevSpec && _.isEqual(prevSpec, transformDetails)) {
                return;
            }

            dispatch(
                registerOrUpdateTransform({
                    ...transformDetails
                })
            );
        });
        previousTransforms.current = normalizedDatasetTransforms;
    }, [normalizedDatasetTransforms, previousTransforms]);

};

