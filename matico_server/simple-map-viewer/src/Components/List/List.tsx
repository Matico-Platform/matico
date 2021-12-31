import React from 'react'
import {Styles} from './ListStyles'

export const Row = Styles.Row  

interface ListProps{
    loading:boolean;
}
export const List : React.FC<ListProps> = ({children,loading})=>{
    if(loading){
        return <h2>Loading</h2>
    }
    return(
        <Styles.ListOuter>
            <Styles.List>
                {children}
            </Styles.List>
        </Styles.ListOuter>
    )
}