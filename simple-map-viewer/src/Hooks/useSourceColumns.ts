import React, {useState,useEffect} from 'react'
import {Column, getDatasetColumns, LayerSource, DatasetSource} from 'api'

export const  useSourceColumns = (source: LayerSource)=> {
    const [columns, setColumns] = useState<undefined|Column[]>(undefined);

    useEffect(()=>{
        const sourceType  = Object.keys(source)[0]
        if (sourceType == "Dataset"){
            const dataset: DatasetSource = source as DatasetSource;
            getDatasetColumns(dataset.Dataset).then(result=>{
                setColumns(result.data)
            })
        }
        else {
            throw Error(`Source type is not implemented yet ${JSON.stringify(source)} `);
        }
    },[source])
    return columns 
}