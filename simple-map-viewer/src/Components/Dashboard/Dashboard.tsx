import React, {useState} from 'react'
import ReactMapGL from 'react-map-gl'
import {Styles} from './DashboardStyles'


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
        </Styles.DashboardOuter>
    )
}