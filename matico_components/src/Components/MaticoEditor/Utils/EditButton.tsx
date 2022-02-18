// import React from "react";
// import { Box, Button } from "grommet";
// import { setCurrentEditPath } from "Stores/MaticoSpecSlice";
// import { useMaticoDispatch } from "Hooks/redux";
// import { useIsEditable } from "Hooks/useIsEditable";
// import { Performance } from "grommet-icons";

// interface EditButtonProps {
//   editPath: string;
//   editType: string;
// }

// export const EditButton: React.FC<EditButtonProps> = ({
//   editPath,
//   editType,
// }) => {
//   const dispatch = useMaticoDispatch();
//   const edit = useIsEditable();
//   if (!edit) return null;
//   return (
//     <Button
//       onClick={() =>
//         dispatch(
//           setCurrentEditPath({
//             editPath,
//             editType,
//           })
//         )
//       }
//       icon={<Performance color="accent-4" />}
//     />
//   );
// };

import React from "react";
import { Button } from "@adobe/react-spectrum";
import { setCurrentEditPath } from "Stores/MaticoSpecSlice";
import { useMaticoDispatch } from "Hooks/redux";
import { useIsEditable } from "Hooks/useIsEditable";
import Settings from "@spectrum-icons/workflow/Settings";

interface EditButtonProps {
  editPath: string;
  editType: string;
  sideEffect: Function;
}

export const EditButton: React.FC<EditButtonProps> = ({
  editPath,
  editType,
  sideEffect=()=>{},
}) => {
  const dispatch = useMaticoDispatch();
  const edit = useIsEditable();
  if (!edit) return null;
  return (
    <Button
      variant="primary"
      onPress={() => {
        dispatch(
          setCurrentEditPath({
            editPath,
            editType,
          })
        );
        sideEffect();
      }}
      isQuiet
    >
      <Settings aria-label="Edit" color="notice" />
    </Button>
  );
};
