import {Source} from '../utils/api'
import {useFeature} from './useFeature'
import { GeoJsonLayer } from 'deck.gl'

export const useMapSelectEditFeature  = (source:Source, featureId:string | number| null, edit:boolean)=>{
  console.log("layer feature id is ", featureId)
  const {feature, featureError, editable} = useFeature(source, featureId, edit, "geojson")
  
  const layer = feature ? new GeoJsonLayer({
    id:"selection",
    data: feature,
    getFillColor: [0, 255,0, 255],
    getLineColor: [0,0,255, 255],
    getRadius:20,
    stroked:true,
    getLineWidth:1,
    lineWidthUnits: "pixels"
  }) : null 

  return {selectionLayer: layer, selectionFeatureError: featureError}
}
