import {DatasetTransform} from "@maticoapp/matico_types/spec";
import {useEffect} from "react";
import {requestTransform} from "Stores/MaticoDatasetSlice";
import {useMaticoDispatch, useMaticoSelector} from "./redux";

export const useTransform =(transform: DatasetTransform)=>{
  const transformResult = useMaticoSelector((selector)=>selector.datasets.transforms[transform.id])
  const dispatch = useMaticoDispatch()

  useEffect(()=>{
      dispatch(
        requestTransform(transform)
      )    

  },[transform])
  return transformResult
}
