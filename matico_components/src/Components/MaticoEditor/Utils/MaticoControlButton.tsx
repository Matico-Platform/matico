import React from "react";
import { setCurrentEditPath, deleteSpecAtPath } from "Stores/MaticoSpecSlice";
import { useMaticoDispatch } from "Hooks/redux";
import { useIsEditable } from "Hooks/useIsEditable";
import { Button } from "@adobe/react-spectrum";
import Settings from "@spectrum-icons/workflow/Settings";
import Delete from "@spectrum-icons/workflow/Delete";

const Icons = {
  "delete": Delete,
  "edit": Settings
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
    <Button
      isQuiet
      variant="overBackground"
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
    </Button>
  );
};
