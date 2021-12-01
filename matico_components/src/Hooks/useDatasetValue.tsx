import {useEffect,useState,useContext} from 'react'
import {MaticoDataContext} from '../../dist'

interface DatasetValueInterface {datasetName:string, column?:string, metric?: DatasetMetric, feature_id?: string};

export const useDatasetValue = ({datasetName, column, metric, feature_id} : DatasetValueInterface)=>{
  const {state}  = useContext(MaticoDataContext)
  const datasets = {state}
}
