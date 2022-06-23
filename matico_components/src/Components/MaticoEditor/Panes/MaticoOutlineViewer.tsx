import React, {useMemo} from "react";
import { View } from "@adobe/react-spectrum";
import { useAppSpec } from "Hooks/useAppSpec";
import { RowEntryMultiButton, RowEntryMultiButtonProps } from "../Utils/RowEntryMultiButton";
import {isArray, isObject} from 'lodash'
import {useApp} from "Hooks/useApp";
import {ContainerPane, Page, PaneRef} from "@maticoapp/matico_types/spec";

function addForContainer( container: ContainerPane, inset: number ){
  let containerPanes: Array<RowEntryMultiButtonProps> = [];

    rowComponents.push(
                {entryName : page.name,
                 inset:inset,
                 compact:true,
                 onSelect: ()=> setEditPage(page.id),
                 onRemove: ()=> removePage(page.id),
                 onRaise: ()=>{},
                 onLower: ()=>{},
                 onDuplicate: ()=>{}
                }
      
    ) 
    inset +=1 
}

export const MaticoOutlineViewer: React.FC = () => {
    // const { pages, panes, setEditPage, removePage} = useApp();
    // const rowComponents = useMemo(() => {
    //   const rowComponents: Array<RowEntryMultiButtonProps> = []
    //   let inset = 0

    //   pages.forEach((page:Page)=>{
    //           rowComponents.push(
    //             {entryName : page.name,
    //              inset:inset,
    //              compact:true,
    //              onSelect: ()=> setEditPage(page.id),
    //              onRemove: ()=> removePage(page.id),
    //              onRaise: ()=>{},
    //              onLower: ()=>{},
    //              onDuplicate: ()=>{}
    //             }
    //           )

    //           inset +=1;
              
    //           page.panes.forEach((paneRef:PaneRef)=>{
    //             const pane = panes.find((p:Pane)=> p.id = paneRef.paneId)
    //             if(pane.type==="container"){
                
    //             }
    //             else{

    //             }
    //           })
    //   })
    //     return panes.map((entry: PaneSpec, i: number) => {
    //         const {
    //             name,
    //             editPath,
    //             editType
    //         } = entry;
    //         // the inset of each row, in EM values -- each inset depth level should be 8 pixels
    //         const inset  = editPath.split('.').length / 2

    //         return <RowEntryMultiButton
    //             entryName={name}
    //             editType={editType}
    //             editPath={editPath}
    //             inset={inset}
    //             compact={true}
    //         />
    //     })
    // },[JSON.stringify(pages)])
    // return <View maxWidth={"100%"}>{...rowComponents}</View>;
    return(
      <h1>Unimplmented</h1>
    )
};
