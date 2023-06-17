import React from 'react'
import { useRecoilValue } from 'recoil'
import { paneNames } from 'Stores/SpecAtoms'
import { Item } from "@adobe/react-spectrum"

export const TabLayoutPaneWrapper: React.FC<React.PropsWithChildren<{ paneRefId: string }>> = ({ paneRefId }) => {
  let paneName = useRecoilValue(paneNames(paneRefId))
  return (
    <Item key={paneRefId}>
      {paneName}
    </Item>
  )

}
