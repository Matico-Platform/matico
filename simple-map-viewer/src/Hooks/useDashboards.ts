import {useState, useEffect}  from 'react'
import {getDashboards, Dashboard} from '../api'

export function useDashboards(){
    const [loading, setLoading] = useState(false);
    const [dashboards, setDashboards] = useState<Dashboard[]>([])
    const [error, setError] = useState<string | null>(null)


    const refreshDashboards = ()=>{
        setLoading(true)
        getDashboards().then((dashboards)=>{
            setDashboards(dashboards.data)
        })
        .catch( (e)=> setError(e.toString()))
        .finally(()=> setLoading(false))

    }
    useEffect(()=>{
        const interval = setInterval(refreshDashboards,5000);
        refreshDashboards()
        return ()=>{ clearInterval(interval)}
    },[])

    return {loading, dashboards,error}
}