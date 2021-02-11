import React from 'react'
import {Styles} from './LayerListStyles'
import {Button, ButtonType} from '../Button/Button'
import {LayerControlls} from '../LayerControlls/LayerControlls'
import {useDashboard} from '../../Contexts/DashbardBuilderContext'
interface LayerListProps{

}

export const LayerList: React.FC<LayerListProps>= ({})=>{
    const {dashboard} = useDashboard();
    const layers = dashboard ? dashboard.map_style.layers : []

    return(
        <Styles.LayerList>
            {layers.map((layer)=>(
                <>
                    <LayerControlls layer={layer}/>
                </>
            ))}

        </Styles.LayerList>
    )
}