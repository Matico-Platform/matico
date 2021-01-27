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
            setLoading(false)
        })
        .catch((e)=>{
            setLoading(false)
            setError(e.toString())
        })
    },[])

    return {datasets,error,loading}
}