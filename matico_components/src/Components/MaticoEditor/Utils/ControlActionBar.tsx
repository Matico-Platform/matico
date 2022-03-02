import React from "react";
import { setCurrentEditPath, deleteSpecAtPath } from "Stores/MaticoSpecSlice";
import { useMaticoDispatch } from "Hooks/redux";
import { useIsEditable } from "Hooks/useIsEditable";
// import {useHover} from '@react-aria/interactions';

import { View, ActionGroup, Item, Text } from "@adobe/react-spectrum";
import Settings from "@spectrum-icons/workflow/Settings";
import Delete from "@spectrum-icons/workflow/Delete";

interface ControlActionBarProps {
  editPath: string;
  editType?: string;
  actions?: string[];
}

export const ControlActionBar: React.FC<ControlActionBarProps> = ({
  editPath,
  editType,
  actions,
}) => {
  // let {hoverProps, isHovered} = useHover({});
  const isHovered = true;
  const hoverProps = {};
  const dispatch = useMaticoDispatch();
  const edit = useIsEditable();
  if (!edit) return null;
  return (
    <span 
    {...hoverProps}>
    <View
      backgroundColor="informative"
      position="absolute"
      width="100%"
      top="0"
      left="0"
      zIndex={500}
      UNSAFE_style={{
        opacity: isHovered ? 1 : 0.1,
        transition: "250ms opacity ease-in-out",
      }}
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
    </View>
    </span>
  );
};
