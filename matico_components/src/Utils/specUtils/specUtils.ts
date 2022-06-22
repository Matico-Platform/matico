import {PaneRef, App,Page, ContainerPane,Pane} from "@maticoapp/matico_types/spec"
import _ from "lodash"

export const EditTypeMapping = {
    pages: "Page",
    layers: "Layer",
    Map: "Map",
    sections: "Section",
    Text: "Text",
    Histogram: "Histogram",
    PieChart: "PieChart",
    Scatterplot: "Scatterplot",
    Controls: "Controls"
};

export const findPaneParents = (spec:App, paneRef:PaneRef)=>{
  const pages = spec.pages.filter((p:Page)=>p.panes.find((p:PaneRef)=> p.id===paneRef.id))
  const containers = spec.panes.filter((p:Pane)=> p.type==='container') as Array<ContainerPane> ;
  const containersWithPane = containers.filter((container:ContainerPane)=> container.panes.find((p:PaneRef)=>p.id===paneRef.id))
  return {pages, containers : containersWithPane}
}

export const findPagesForPane = (spec:App,paneRef:PaneRef)=>{
    let {pages,containers} = findPaneParents(spec,paneRef);
    while(containers.length > 0){
      let consideration  = containers.pop()
      let {pages: considerationPages, containers: considerationContainers} = findPaneParents(spec, {id:consideration.id, type:'container'})
      _.extend(pages, considerationPages)
      _.extend(containers, considerationContainers)
    }

    let pageSet = Array.from(new Set(pages))
    return pageSet
}

