import React, { useEffect, useState } from "react";
import { EditableGeoJsonLayer} from "@nebula.gl/layers";
import {DrawRectangleMode, DrawPolygonMode, DrawPolygonByDraggingMode} from "nebula.gl"
import { Toolbox } from "@nebula.gl/editor";
import { GeoJSON } from "@types/geojson";
import {AutoVariableInterface, useAutoVariable} from "Hooks/useAutoVariable";
import {SelectionMode} from '@maticoapp/matico_types/spec'

interface SelectionLayerProps {
    onSelection?: (selection: GeoJSON) => void;
    selectionEnabled: boolean;
    selectionMode: SelectionMode,
    onUpdate: (layerState: any) => void;
    mapName: string
}

const SelectionModeMapping= {
  "rectangle" : DrawRectangleMode,
  "lasso" : DrawPolygonByDraggingMode,
  "polygon" : DrawPolygonMode
}

export const MaticoSelectionLayer: React.FC<SelectionLayerProps> = ({
    onSelection,
    selectionEnabled,
    selectionMode,
    onUpdate,
    mapName
}) => {
  
    const [selectionVariable, setSelectionVariable] = useAutoVariable({
        name: `${mapName}_selection`,
        type: "GeoJSON",
        initialValue: null,
        bind: true
    } as AutoVariableInterface);
  
    const [selection, setSelection] = useState<GeoJSON>({
        type: "FeatureCollection",
        features: []
    });

    console.log("internal selection is ",selection)

    useEffect(()=>{

    if (selectionEnabled) {
        const editableLayer = new EditableGeoJsonLayer({
            id: "selection",
            data: selection,
            mode: SelectionMode[DrawRectangleMode],
            selectedFeatureIndexes:[0],
            onEdit: ( {updatedData}) => {
                setSelection(updatedData);
                if(onSelection){
                  onSelection(updatedData);
                }
                setSelectionVariable(updatedData)
            }
        });
        onUpdate(editableLayer);
    }
    else{
        onUpdate(null)
    }

    },[selectionEnabled, selectionMode])


    return <></>;
};
