import React from 'react'
import { useRecoilValue } from 'recoil'
import { MaticoContainerPaneInterface } from './MaticoContainerPane'
import { isEditingAtom } from 'Stores/StateAtoms'
import { layoutForContainer, paneRefsForParent } from "Stores/SpecAtoms"

export const withContainerPaneSelector: (paneId: string, PaneImplementation: React.FC<MaticoContainerPaneInterface>) => React.ReactElement = (paneId, PaneImplementation) => {

  const edit = useRecoilValue(isEditingAtom);
  const layout = useRecoilValue(layoutForContainer({ containerId: paneId, containerType: "pane" }));
  const paneRefs = useRecoilValue(paneRefsForParent(paneId))

  return (
    <PaneImplementation edit={edit} layout={layout} id={paneId} paneRefs={paneRefs} />
  )

}
