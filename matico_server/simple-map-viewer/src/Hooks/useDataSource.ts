import {useState, useEffect} from 'react'
import api from 'api'

enum SortDirection{
    ASSCENDING ='asc',
    DESCENDING ='desc'
}

export type DataSource={
    datasetId?: string,
    sql?: string
}

const formatUrlWith = (source:DataSource, page: number, perPage: number, sortDirection: SortDirection, sortCol: string | null)=>{
    let url ='';

    if(source.datasetId){
        url = `datasets/${source.datasetId}/data`;
    }
    else if (source.sql){
        url = `queries/run`;
    }

    const params = new URLSearchParams()

    if(sortCol){
        params.append('sort', `${sortCol}`)
        params.append('sort', `${sortDirection ? sortDirection : SortDirection.DESCENDING}`)
    }

    params.append("limit", `${perPage}`)
    params.append("offset", `${page*perPage}`)

    if(source.sql){
        params.append("q",source.sql)
    }
    return `${url}?${params.toString()}` 
}

type SourceParams = {
    perPage: number
}

export const useDataSource = (source:DataSource, params?:SourceParams)=>{
    const [page,setPage] = useState<number>(0);
    const [sortCol, setSortCol] = useState<string |null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection|null>(null);
    const [data, setData] = useState<any|null>(null)
    const [total,setTotal] = useState<number| null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string| null> (null)
    const [pages, setPages] = useState<number |null>(null)

    const perPage = params?.perPage ? params.perPage : 40
    
    useEffect(()=>{
        console.log(source, params, page, sortCol, sortDirection )
        setLoading(true)
        api.get(formatUrlWith(source, page ? page : 1 ,perPage, sortDirection ? sortDirection : SortDirection.ASSCENDING, sortCol))
        .then( (response : any) =>{
            setData(response.data.data),
            setTotal(response.data.metadata.total)
            setPages(Math.ceil(response.data.metadata.total / perPage))
            setLoading(false)
        })
    },[JSON.stringify(source),page,perPage])

    return {data,error, loading, total, page, pages, setPage, sortCol, setSortCol, sortDirection,setSortDirection}
}