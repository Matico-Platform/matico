import React, { useEffect, useState } from "react";
import { EditableGeoJsonLayer} from "@nebula.gl/layers";
import {DrawRectangleMode} from "nebula.gl"
import { Toolbox } from "@nebula.gl/editor";


import { StaticMap } from "react-map-gl";
import { GeoJSON } from "@types/geojson";
import {AutoVariableInterface, useAutoVariable} from "Hooks/useAutoVariable";

interface SelectionLayerProps {
    onSelection?: (selection: GeoJSON) => void;
    selectionEnabled: boolean;
    polygonSelection: boolean;
    rectangleSelection: boolean;
    onUpdate: (layerState: any) => void;
    mapName: string
}

export const MaticoSelectionLayer: React.FC<SelectionLayerProps> = ({
    onSelection,
    selectionEnabled,
    polygonSelection,
    rectangleSelection,
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
            mode: DrawRectangleMode,
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

    },[selectionEnabled])


    return <></>;
};
