import { TabList, TabPanels, Tabs, Item } from '@adobe/react-spectrum'
import { Layout, TabLayout } from '@maticoapp/matico_types/spec'
import { CollectionChildren } from '@react-types/shared'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { paneName } from 'Stores/SpecAtoms'

const TabItem: React.FC<{ paneId: string }> = ({ paneId }) => {
  let name = useRecoilValue(paneName(paneId));
  return <Item key={name}>{name}</Item>
}


export const TabLayoutContainer: React.FC<{ layout: Layout, children: CollectionChildren<unknown> }> = ({ layout, children }) => {
  if (layout.type !== 'tabs') { throw Error("Expected this to be a tab container") }

  let { type, ...tabLayout } = layout as { type: 'tabs' } & TabLayout

  let childPanes = Array.isArray(children) ? children : [children]


  return (
    <Tabs orientation={tabLayout.tabBarPosition}>
      <TabList>
        {childPanes.map((p: any) =>
          <TabItem paneId={p.key} />
        )}
      </TabList>
      <TabPanels>
        {children}
      </TabPanels>
    </Tabs>
  )
}
