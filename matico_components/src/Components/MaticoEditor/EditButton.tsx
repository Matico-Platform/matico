import React from "react";
import { Box, Button } from "grommet";
import { setCurrentEditPath } from "../../Stores/MaticoSpecSlice";
import { useMaticoDispatch } from "../../Hooks/redux";
import { useIsEditable } from "../../Hooks/useIsEditable";
import { Performance } from "grommet-icons";

interface EditButtonProps {
  editPath: string;
  editType: string;
}

export const EditButton: React.FC<EditButtonProps> = ({
  editPath,
  editType,
}) => {
  const dispatch = useMaticoDispatch();
  const edit = useIsEditable();
  if (!edit) return null;
  return (
    <Button
      onClick={() =>
        dispatch(
          setCurrentEditPath({
            editPath,
            editType,
          })
        )
      }
      icon={<Performance color="accent-4" />}
    />
  );
};
