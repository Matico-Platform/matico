// import React from "react";
// import { setCurrentEditPath, deleteSpecAtPath } from "Stores/MaticoSpecSlice";
// import { useMaticoDispatch } from "Hooks/redux";
// import { useIsEditable } from "Hooks/useIsEditable";
// import { Performance } from "grommet-icons";
// import { Button } from "@adobe/react-spectrum";

// interface EditButtonProps {
//   editPath: string;
//   editType?: string;
//   action: string;
// }

// export const EditButton: React.FC<EditButtonProps> = ({
//   editPath,
//   editType,
//   action,
// }) => {
//   const dispatch = useMaticoDispatch();
//   const edit = useIsEditable();

//   if (!edit) return null;

//   return (
//     <Button
//       isQuiet
//       variant="overBackground"
//       onPress={() => {
//         switch (action) {
//           case "delete":
//             dispatch(
//               deleteSpecAtPath({
//                 editPath,
//               })
//             );
//           case "edit":
//             dispatch(
//               setCurrentEditPath({
//                 editPath,
//                 editType,
//               })
//             );
//         }
//       }}
//     >
//       <Performance color="accent-4" />
//     </Button>
//   );
// };
