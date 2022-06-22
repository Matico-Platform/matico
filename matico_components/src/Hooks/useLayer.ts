import {Layer, Pane} from "@maticoapp/matico_types/spec"
import {setLayerOrder, updateLayer, removeLayer} from "Stores/MaticoSpecSlice"
import {useMaticoDispatch, useMaticoSelector} from "./redux"
import _ from 'lodash'

export const useLayer= (layerId: string, mapId:string)=>{
  const pane = useMaticoSelector((selector)=> selector.spec.spec.panes.find((p:Pane)=>p.id===mapId))
  const dispatch = useMaticoDispatch()
  const mapPane = pane.type==='map' ? pane : null 

  const layer = mapPane.layers.find((layer:Layer)=>layer.id === layerId)

  const layerIndex = _.indexOf(mapPane.layers,layer)

  const _updateLayer = (update: Partial<Layer>)=>{
    dispatch(updateLayer({update,layerId, mapId}))
  }

  const raiseLayer = ()=>{
    let newIndex= layerIndex +1;

    dispatch(setLayerOrder({newIndex,layerId, mapId}))
  }

  const lowerLayer = ()=>{
    let newIndex= layerIndex +1;
    dispatch(setLayerOrder({newIndex,layerId, mapId}))
  }

  const _removeLayer = ()=>{
    dispatch(removeLayer({layerId, mapId}))
  }
 
  return {layer, updateLayer: _updateLayer, raiseLayer, lowerLayer, removeLayer : _removeLayer}

}
