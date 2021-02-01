import React from 'react'
import {Styles} from './DatasetViewDetailsStyles'
import {Tabs,Tab} from '../Tabs/Tabs'
import {QueryPane} from '../QueryPane/QueryPane'

interface DatasetViewDetailsProps{
    feature?: any;
}

export const DataSetViewDetails : React.FC<DatasetViewDetailsProps>= ({feature})=>{
    return(
        <Styles.DatasetViewDetails>
            <Tabs>
                <Tab name='Query'>
                    <QueryPane />
                </Tab>
                <Tab name='Feature'>
                    <h1>Feature details</h1>
                    
                </Tab>
            </Tabs>

        </Styles.DatasetViewDetails>
    )
}