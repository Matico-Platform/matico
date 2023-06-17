import styled from "styled-components";
import React, { useRef } from 'react'
import { Layout } from "@maticoapp/matico_types/spec";

const FreeArea = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    flex: 1;
`;


export const FreeLayoutContainer: React.FC<React.PropsWithChildren<{ layout: Layout }>> = ({ layout, children }) => {
  return (
    <FreeArea>
      {children}
    </FreeArea>
  );
};
