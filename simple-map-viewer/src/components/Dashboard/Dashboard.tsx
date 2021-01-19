import React, {useState} from 'react'
import ReactMapGL from 'react-map-gl'
import {Styles} from './DashboardStyles'
import 'mapbox-gl/dist/mapbox-gl.css';


interface DashboardProps{

}


export const Dashboard: React.FC<DashboardProps> = ({})=>{

    const [viewport, setViewport] = useState({
        latitude: 37.7577,
        longitude: -122.4376,
        zoom:8
    })

    return (
        <Styles.DashboardOuter>
            <Styles.Map>
                <ReactMapGL
                    {...viewport}
                    width="100%"
                    height="100%"
                    mapboxApiAccessToken="pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw"
                    onViewportChange={(viewport)=> setViewport(viewport)}
                />
            </Styles.Map>
            <Styles.Stats>
            </Styles.Stats>
        </Styles.DashboardOuter>
    )
}