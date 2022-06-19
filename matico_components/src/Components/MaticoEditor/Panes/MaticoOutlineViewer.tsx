import React, {useMemo} from "react";
import { View } from "@adobe/react-spectrum";
import { useAppSpec } from "Hooks/useAppSpec";
import { RowEntryMultiButton, RowEntryMultiButtonProps } from "../Utils/RowEntryMultiButton";
import {isArray, isObject} from 'lodash'

const EDIT_TYPE_MAPPINGS = {
  "pages":"Page",
  "sections":"Section",
  "Container": "Container",
  "Map": "Map",
  "layers":"Layer",
  "Scatterplot": "Scatterplot",
  "Text":"Text",
  "Histogram":"Histogram",
  "PieChart":"PieChart"
}

function traverseObj(obj: any, parentPrefix: any, mutableObject: any){
    if (isArray(obj)){
      obj.forEach((entry, idx) => {
          if (isObject(entry) && Object.keys(entry).length === 1){
            mutableObject.push({
                // @ts-ignore
              name: entry[Object.keys(entry)[0]].name, 
              editPath:`${parentPrefix}.${idx}.${Object.keys(entry)[0]}`,
              // @ts-ignore
              editType: EDIT_TYPE_MAPPINGS[Object.keys(entry)[0]]
            })
            traverseObj(
                // @ts-ignore
              entry[Object.keys(entry)[0]], 
              `${parentPrefix}.${idx}.${Object.keys(entry)[0]}`, 
              mutableObject
            )
          } else {
            mutableObject.push({
              name:entry.name,
              editPath:`${parentPrefix}.${idx}`,
              // @ts-ignore
              editType: EDIT_TYPE_MAPPINGS[parentPrefix.split('.').slice(-1)[0]]
            })
            traverseObj(entry, `${parentPrefix}.${idx}`, mutableObject)     
          } 
      })
    } else if (isObject(obj)){
      Object.entries(obj).forEach(([key, val],idx) => {
        if (isArray(val)){
          traverseObj(val, `${parentPrefix}.${key}`, mutableObject)
        } else if (isObject(val)) {
          
        }
      })
    }
    return mutableObject
}

const handleTraversal = (pages: any[]) => {
  let mutableObject: any = []
  traverseObj(pages, 'pages', mutableObject)
  return mutableObject
}
interface PaneSpec {
    name: string,
    type: string,
    editPath: string,
    editType: string
}

export const MaticoOutlineViewer: React.FC = () => {
    const { pages } = useAppSpec();
    const rowComponents = useMemo(() => {
        const panes = handleTraversal(pages)
        return panes.map((entry: PaneSpec, i: number) => {
            const {
                name,
                editPath,
                editType
            } = entry;
            // the inset of each row, in EM values -- each inset depth level should be 8 pixels
            const inset  = editPath.split('.').length / 2

            return <RowEntryMultiButton
                entryName={name}
                editType={editType}
                editPath={editPath}
                inset={inset}
                compact={true}
            />
        })
    },[JSON.stringify(pages)])
    return <View maxWidth={"100%"}>{...rowComponents}</View>;
};
