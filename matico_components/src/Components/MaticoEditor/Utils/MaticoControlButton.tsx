import React from "react";
import { setCurrentEditPath, deleteSpecAtPath } from "Stores/MaticoSpecSlice";
import { useMaticoDispatch } from "Hooks/redux";
import { useIsEditable } from "Hooks/useIsEditable";
import { ActionButton, Button } from "@adobe/react-spectrum";
import Settings from "@spectrum-icons/workflow/Settings";
import Delete from "@spectrum-icons/workflow/Delete";
import Move from "@spectrum-icons/workflow/Move";
import Resize from "@spectrum-icons/workflow/Resize";
import ChevronDown from "@spectrum-icons/workflow/ChevronDown";
import ChevronRight from "@spectrum-icons/workflow/ChevronRight";

const Icons = {
  "delete": Delete,
  "edit": Settings,
  "move": Move,
  "resize": Resize,
  "resizeY": ChevronDown,
  "resizeX": ChevronRight
}

interface ControlButtonProps {
  editPath: string;
  editType?: string;
  action: string;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
  editPath,
  editType,
  action,
}) => {
  const dispatch = useMaticoDispatch();
  const edit = useIsEditable();
  const Icon = Icons[action];
  if (!edit) return null;

  return (
    <ActionButton
      isQuiet
      onPress={() => {
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
      <Icon />
    </ActionButton>
  );
};
