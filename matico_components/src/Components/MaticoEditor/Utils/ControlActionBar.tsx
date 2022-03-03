import React from "react";
import { setCurrentEditPath, deleteSpecAtPath } from "Stores/MaticoSpecSlice";
import { useMaticoDispatch } from "Hooks/redux";
import { useIsEditable } from "Hooks/useIsEditable";
// import {useHover} from '@react-aria/interactions';

import { View, ActionGroup, Item, Text } from "@adobe/react-spectrum";
import Settings from "@spectrum-icons/workflow/Settings";
import Delete from "@spectrum-icons/workflow/Delete";
import styled from "styled-components";
import Move from "@spectrum-icons/workflow/Move";
import Info from "@spectrum-icons/workflow/Info";
import Duplicate from "@spectrum-icons/workflow/Duplicate";

interface ControlActionBarProps {
  editPath: string;
  editType?: string;
  actions?: string[];
}

const ControlBarContainer = styled.div`
  opacity:0.1;
  transition: 250ms opacity ease-in;
  position:absolute;
  width:100%;
  top:0;
  left:0;
  z-index:20;
  &:hover {
    opacity:1;
  }
`

export const ControlActionBar: React.FC<ControlActionBarProps> = ({
  editPath,
  editType,
  actions,
}) => {
  const dispatch = useMaticoDispatch();
  const edit = useIsEditable();
  if (!edit) return null;
  return (
    <ControlBarContainer>
      <View
        backgroundColor="informative"
        borderColor="default"
        borderWidth="thin"
      >
        <ActionGroup
          isQuiet
          buttonLabelBehavior="hide"
          overflowMode="collapse"
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
          <Item key="move">
              <Move />
              <Text>Move</Text>
          </Item>
          <Item key="edit">
              <Settings />
              <Text>Edit</Text>
          </Item>
          <Item key="duplicate">
              <Duplicate />
              <Text>Duplicate</Text>
          </Item>
          <Item key="docs">
              <Info/>
              <Text>Component Docs</Text>
          </Item>
          <Item key="delete">
              <Delete/>
              <Text>Delete</Text>
          </Item>
        </ActionGroup>
      </View>
    </ControlBarContainer>
  );
};
