import { Layout, LinearLayout, TabLayout } from '@maticoapp/matico_types/spec'
import React from 'react'

export interface LayoutParts {
  Container: React.FC<React.PropsWithChildren<{ layout: Layout }>>,
  PaneWrapper: React.FC<React.PropsWithChildren<{ paneRefId: string }>>,
  type: "linear" | "tab" | "free",
  label: string,
  onDropFromSelf: () => boolean,
  onDropFromOther: () => boolean,
  default: Partial<Layout>
  Editor: React.FC<{ layout: Layout, onChange: (update: Partial<Layout>) => void }>
}
