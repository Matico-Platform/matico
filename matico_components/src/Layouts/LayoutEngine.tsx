import React from 'react'
import { PaneSelector } from './PaneSelector'
import { Layouts } from '.'
import { LayoutParts } from './LayoutParts'
import { Layout } from "@maticoapp/matico_types/spec"

export const LayoutEngine: React.FC<React.PropsWithChildren<{ layout: Layout, paneRefIds: Array<string> }>> = ({ layout, paneRefIds }) => {
  if (!(layout?.type in Layouts)) {
    throw Error(`Tried to setup a layout that was unknown. Layout is ${layout}`)
  }

  let Layout: LayoutParts = Layouts[layout.type]

  return (
    <Layout.Container layout={layout}>
      {paneRefIds.map((id) =>
        <Layout.PaneWrapper paneRefId={id}>
          <PaneSelector paneRefId={id} />
        </Layout.PaneWrapper>
      )}

    </Layout.Container>
  )

}
