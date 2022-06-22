import React from "react";
import { useMaticoDispatch } from "Hooks/redux";
import { useIsEditable } from "Hooks/useIsEditable";
import { View, Flex } from "@adobe/react-spectrum";
import styled from "styled-components";
import { ControlButton } from "./MaticoControlButton";
import {PaneRef} from "@maticoapp/matico_types/spec";

interface ControlActionBarProps {
  paneRef: PaneRef,
  actions?: string[];
}

const ControlBarContainer = styled.span`
  opacity:0.05 ;
  transition: 250ms opacity ease-in;
  position:absolute;
  width:100%;
  top:0;
  left:0;
  z-index:20;
  height:100%;
  pointer-events:none;
  * {
    pointer-events:auto;
  }
  &:hover, &:focus {
    opacity:1;
  }
`
export const ControlActionBar: React.FC<ControlActionBarProps> = ({
  paneRef,
  actions = ["edit", "delete", "move", "resize", "docs"],
}) => {

  const edit = useIsEditable();
  if (!edit) return null;
  return (
    <ControlBarContainer>
      <View
        position="absolute"
        left="size-50"
        top="size-50"
        backgroundColor="informative"
        borderRadius="large"
        borderColor="static-black"
        borderWidth="thin"
      >
        <ControlButton
          paneRef={paneRef}
          action="move"
        />
      </View>

      <Flex
        direction="column"
        position="absolute"
        right="size-50"
        top="size-50"
      >
        <View
          backgroundColor="informative"
          borderRadius="large"
          borderColor="static-black"
          borderWidth="thin"
        >
          <ControlButton
            paneRef={paneRef}
            action="edit"
          />
        </View>
        <View
          backgroundColor="negative"
          borderRadius="large"
          borderColor="static-black"
          borderWidth="thin"
        >
          <ControlButton
            paneRef={paneRef}
            action="delete"
          />
        </View>
      </Flex>
      
      <View
          backgroundColor="informative"
          borderRadius="large"
          borderColor="static-black"
          borderWidth="thin"
          position="absolute"
          right="size-50"
          bottom="size-50"
        >
          <ControlButton
            paneRef={paneRef}
            action="resize"
          />
        </View>
      <View
          backgroundColor="informative"
          borderTopStartRadius="large"
          borderTopEndRadius="large"
          borderColor="static-black"
          borderWidth="thin"
          position="absolute"
          left="50%"
          bottom="0px"
        >
          <ControlButton
            paneRef={paneRef}
            action="resizeY"
          />
        </View>
      <View
          backgroundColor="informative"
          borderBottomStartRadius="large"
          borderTopStartRadius="large"
          borderColor="static-black"
          borderWidth="thin"
          position="absolute"
          top="50%"
          right="0px"
        >
          <ControlButton
            paneRef={paneRef}
            action="resizeX"
          />
        </View>
    </ControlBarContainer>
  );
};
