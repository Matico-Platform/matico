import {useState,useEffect} from 'react'
import {getDatasets, Dataset} from '../api'

export const useDatasets =()=>{
    const [datasets ,setDatasets]= useState<Dataset[]>([]);
    const [loading, setLoading] = useState<boolean> (false);
    const [error, setError] = useState<string|null>(null);

    useEffect(()=>{
        setLoading(true)
        getDatasets().then((result)=>{
            setDatasets(result.data)
        })
        .catch((e)=>{
            setError(e.toString())
        })
        .finally(()=>{
            setLoading(false)
        })
    },[])

    return {datasets,error,loading}
}