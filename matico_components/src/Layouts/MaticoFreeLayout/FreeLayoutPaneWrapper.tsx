import styled from "styled-components";
import React from 'react'
import { useRecoilValue } from "recoil";
import { PanePosition } from "@maticoapp/matico_types/spec";
import { paneRefAtomFamily } from "Stores/SpecAtoms";
import { handleUnits } from "Layouts/utils";

const PaneWrapper = styled.div<PanePosition>`
  box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1),3px -7px 15px -3px rgba(0,0,0,0.05);
  box-sizing:border-box;
  position:absolute;
  width:${({ width, widthUnits }) => `${width}${handleUnits(widthUnits)}`};
  height:${({ height, heightUnits }) => `${height}${handleUnits(heightUnits)}`};
  z-index: ${({ layer }) => `${layer}`};
  left:${({ x, xUnits }) => `${x}${handleUnits(xUnits)}`};
  top:${({ y, yUnits }) => `${y}${handleUnits(yUnits)}`};
  padding-bottom:${({ padBottom, padUnitsBottom }) => `${padBottom}${handleUnits(padUnitsBottom)}`};
  padding-top:${({ padTop, padUnitsTop }) => `${padTop}${handleUnits(padUnitsTop)}`};
  padding-left:${({ padLeft, padUnitsLeft }) => `${padLeft}${handleUnits(padUnitsLeft)}`};
  padding-right:${({ padRight, padUnitsRight }) => `${padRight}${handleUnits(padUnitsRight)}`};
`

export const FreeLayoutPaneWrapper: React.FC<React.PropsWithChildren<{ paneRefId: string }>> = ({
  paneRefId,
  children
}) => {
  const paneRef = useRecoilValue(paneRefAtomFamily(paneRefId))

  return (
    <PaneWrapper className="pane_wrapper" {...paneRef.position}>
      {children}
    </PaneWrapper>
  );
};
