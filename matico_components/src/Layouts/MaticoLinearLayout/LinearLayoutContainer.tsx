import React from 'react'
import { Layout, LinearLayout } from "@maticoapp/matico_types/spec"
import styled from "styled-components"

const PaneContainer = styled.div<LinearLayout>`
  width: 100%;
  height:100%;
  overflow-x: ${({ direction, allowOverflow }) => direction === 'row' && allowOverflow ? "auto" : "hidden"};
  overflow-y: ${({ direction, allowOverflow }) => direction === 'column' && allowOverflow ? "auto" : "hidden"};
  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => align};
  gap: ${({ gap }) => gap};
  display:flex;
  flex-direction:${({ direction }) => direction};
  direction: ${({ direction }) => direction};
`

export const LinearLayoutContainer: React.FC<{
  layout: Layout
}> = ({ layout, children }) => {
  if (layout.type !== 'linear') { throw Error("Expcted this to be a linear container") }

  return (<PaneContainer {...layout}>
    {children}
  </PaneContainer>
  )
};
