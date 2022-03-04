import React from "react";
import { setCurrentEditPath, deleteSpecAtPath } from "Stores/MaticoSpecSlice";
import { useMaticoDispatch } from "Hooks/redux";
import { useIsEditable } from "Hooks/useIsEditable";
// import {useHover} from '@react-aria/interactions';

import { View, ActionGroup, Item, Text, Flex } from "@adobe/react-spectrum";
import Settings from "@spectrum-icons/workflow/Settings";
import Delete from "@spectrum-icons/workflow/Delete";
import styled from "styled-components";
import { ControlButton } from "./MaticoControlButton";

interface ControlActionBarProps {
  editPath: string;
  editType?: string;
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
  editPath,
  editType,
  actions = ["edit", "delete", "move", "resize", "docs"],
}) => {
  const dispatch = useMaticoDispatch();
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
          editPath={editPath}
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
            editPath={editPath}
            editType={editType}
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
            editPath={editPath}
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
            editPath={editPath}
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
            editPath={editPath}
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
            editPath={editPath}
            action="resizeX"
          />
        </View>
      {/* <View
        backgroundColor="informative"
        width="100%"
        borderColor="default"
        borderWidth={"thick"}
      >
        <ActionGroup
          isQuiet
          buttonLabelBehavior="hide"
          onAction={(action) => {
              switch (action) {
                  case "delete":
                  dispatch(
                      deleteSpecAtPath({
                        editPath,
                      })
                  );
                  case "edit":
                  dispatch(
                      setCurrentEditPath({
                        editPath,
                        editType,
                      })
                  );
                  default:
                  return;
                  }
              }}
          >
          <Item key="edit">
              <Settings />
              <Text>Edit</Text>
          </Item>
          <Item key="delete">
              <Delete/>
              <Text>Delete</Text>
          </Item>
        </ActionGroup>
      </View> */}
    </ControlBarContainer>
  );
};
