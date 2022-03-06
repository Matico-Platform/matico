import {
    deleteSpecAtPath,
    setCurrentEditPath,
    duplicateSpecAtPath,
    reconcileSpecAtPath,
    setSpecAtPath
} from "Stores/MaticoSpecSlice";
import { useMaticoDispatch } from "./redux";
import { useIsEditable } from "./useIsEditable";

export const usePaneActions = (editPath: string): voidFunc[] => {
    const edit = useIsEditable();
    const dispatch = useMaticoDispatch();
    if (!edit) return [];

    // Returns a set of helper functions that can be used to update the spec
    // Optional path parameter can overwrite the default hook path, but otherwise called
    // as eg. openEditPane() will just open the pane the hook was called with

    const openEditPane = (editType, path = editPath) =>
        dispatch(setCurrentEditPath({ editPath: path, editType }));

    const deletePane = (path = editPath) =>
        dispatch(deleteSpecAtPath({ editPath: path }));

    const duplicatePane = (path = editPath) =>
        dispatch(duplicateSpecAtPath({ editPath: path }));

    const updatePaneSpec = (update: any, path = editPath) =>
        dispatch(setSpecAtPath({ editPath: path, update }));

    const reconcilePaneSpec = (update: any, path = editPath) =>
        dispatch(reconcileSpecAtPath({ editPath: path, update }));

    const movePane = (position: PositionPropsOptional, path = editPath) =>
        dispatch(
            reconcileSpecAtPath({
                editPath: path,
                update: { position: position }
            })
        );

    return [
        openEditPane,
        deletePane,
        movePane,
        duplicatePane,
        updatePaneSpec,
        reconcilePaneSpec
    ];
};

// type
type voidFunc = (() => void) | ((e: any) => void);

interface PositionPropsOptional {
    height?: number;
    width?: number;
    x?: number;
    y?: number;
    height_units?: "Percent" | "Pixels";
    width_units?: "Percent" | "Pixels";
    x_units?: "Percent" | "Pixels";
    y_units?: "Percent" | "Pixels";
    layer?: number;
}
