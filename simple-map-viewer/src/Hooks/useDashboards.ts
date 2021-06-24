import { useState, useEffect } from 'react';
import { getDashboards,  deleteDashboard } from 'api';
import {Dashboard} from 'types'

export function useDashboards() {
    const [loading, setLoading] = useState(false);
    const [dashboards, setDashboards] = useState<Dashboard[]>([]);
    const [error, setError] = useState<string | null>(null);

    const refreshDashboards =  ()=> {
        setLoading(true);
        getDashboards()
            .then((dashboards) => {
                setDashboards(dashboards.data);
            })
            .catch((e) => setError(e.toString()))
            .finally(() => setLoading(false));
    };

    const deleteDash =(dashboard_id: string)=>{
        deleteDashboard(dashboard_id).then(()=>{
            refreshDashboards();
        })
        .catch(e=> setError(e.toString()))
    }

    useEffect(()=> refreshDashboards(), [])

    return { loading, dashboards, error, refreshDashboards, deleteDashboard:deleteDash};
}
