import {useState,useEffect} from 'react'
import {getUniqueColumnValues, ValueCount, LayerSource, DatasetSource} from 'api'

export function useUniqueColumnValues(source?: LayerSource, column_name?: string){
    const [columnValues, setColumnValues] = useState<undefined | ValueCount[]>(undefined)

    useEffect(()=>{
        if(source && column_name){
            if(Object.keys(source)[0]=='Dataset'){
                const datasetSource = source as DatasetSource;

                getUniqueColumnValues(datasetSource.Dataset,column_name).then((result)=>{
                    console.log("result from querry ",result)
                    setColumnValues(result.data.ValueCounts)
                })
                .catch(e=>{
                    console.log("failed to get column values",e)
                    setColumnValues(undefined)
                })
            }
            else{
                throw Error("Layer source does not implement this functionality yet")
            }
        }
        else{
            setColumnValues(undefined)
        }
    },[source, column_name])

    return columnValues
}