import React from 'react'
import {useParams} from 'react-router'
import {useDataset, useDatasetPagedResults} from '../../Hooks/useDataset'
import {Styles} from './DatasetViewPageStyles'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import DeckGL from '@deck.gl/react';
import {MVTLayer} from '@deck.gl/geo-layers';
import {StaticMap} from 'react-map-gl';

const TOKEN='pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw';

interface DatasetViewPageProps{

}

interface ParamTypes{
    id:string
}

const INITIAL_VIEW_STATE = {
  longitude: -74.0060,
  latitude: 40.7128,
  zoom: 10,
  pitch: 0,
  bearing: 0
};

const valueToTableEntry = (value:any)=>{
    if(!value){
        return 'Null'
    }
    else if (typeof(value)==='object'){
        return value.type
    }
    else{
        return value
    }
}

export const DatasetViewPage: React.FC<DatasetViewPageProps>=({})=>{
    const {id} = useParams<ParamTypes>()
    const {dataset,loading,error} = useDataset(id)
    const {data,loading: dataLoading ,error: dataError} = useDatasetPagedResults(id,{limit:40,offset:0})

    const layer = dataset ? new MVTLayer(
    {
        data:`http://localhost:8080/tiler/${dataset.id}/{z}/{x}/{y}`,

    }        
    ) : null
    return(
        <Styles.DatasetViewPageContainer>
            <h1>{loading ? id : dataset?.name}</h1>
            {data && 
                <>
                <Styles.DataTable>
                    <tr>
                        {Object.keys(data[0]).map((header)=>(
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                    {data.map((datum:any)=>(
                        <tr>
                            {Object.values(datum).map((value:any,index)=>(
                                <td key={index}>{valueToTableEntry(value)}</td>
                            ))}
                            <td><FontAwesomeIcon icon={faEdit}/></td>
                        </tr>
                    ))}
                    
                </Styles.DataTable>

                <Styles.Map>
                    <DeckGL width={"100%"} height={"100%"} initialViewState={INITIAL_VIEW_STATE} layers={layer ? [layer] : [] as any} controller={true} >
                      <StaticMap mapboxApiAccessToken={TOKEN} width={"100%"} height={"100%"} mapStyle={"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"} />
                    </DeckGL>
                </Styles.Map>
                </>
            }
        </Styles.DatasetViewPageContainer>
    )
}