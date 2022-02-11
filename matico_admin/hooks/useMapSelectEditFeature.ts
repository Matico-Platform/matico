import {Source} from '../utils/api'
import {useFeature} from './useFeature'
import { GeoJsonLayer } from 'deck.gl'
import {ViewMode, ModifyMode} from '@nebula.gl/edit-modes'
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import {useEffect, useState} from 'react';


export const useMapSelectEditFeature  = (source:Source, featureId:string | number| null, edit:boolean)=>{


  const {feature, featureError, editable, mutateFeature, updateFeature} = useFeature(source, featureId, edit, "geojson")

  const [editFeature, setEditFeature] = useState(feature)

  const discardGeometryChanges = ()=>{
    setEditFeature(feature)
  }

  const saveGeometry = ()=>{
    console.log("saving changes ", editFeature)
  }

  useEffect(()=>{
    setEditFeature(feature)
  },[feature])


  let layer =null;
  if(feature){
    if( edit ){
      layer = new EditableGeoJsonLayer({
        id:"editFeature",
        data:editFeature,
        mode:ModifyMode,
        selectedFeatureIndexes:[0],
        onEdit: ({updatedData})=>{
          console.log("Update data is ",updatedData)
          setEditFeature(updatedData)
        }
      })
    }
    else{
      layer =  new GeoJsonLayer({
        id:"selection",
        data: feature,
        getFillColor: [0, 255,0, 255],
        getLineColor: [0,0,255, 255],
        getRadius:20,
        stroked:true,
        getLineWidth:1,
        lineWidthUnits: "pixels"
      }) 
    }
  }
  console.log("editing ", edit, ' returning ', layer )

  return {selectionLayer: layer, selectionFeatureError: featureError, saveGeometry, discardGeometryChanges}
}
