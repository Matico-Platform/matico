import {
    deleteSpecAtPath,
    setCurrentEditPath,
    duplicateSpecAtPath,
    reconcileSpecAtPath,
    setSpecAtPath,
    removeSpecAtPath,
    reorderAtSpec
} from "Stores/MaticoSpecSlice";
import { useMaticoDispatch } from "./redux";
import { useIsEditable } from "./useIsEditable";

export const useSpecActions = (
    editPath: string,
    editType: string
): any => {
    const edit = useIsEditable();
    const dispatch = useMaticoDispatch();
    if (!edit) return {};

    // Returns a set of helper functions that can be used to update the spec
    // Optional path parameter can overwrite the default hook path, but otherwise called
    // as eg. openEditPane() will just open the pane the hook was called with

    const openEditor = (type = editType, path = editPath) =>
        dispatch(setCurrentEditPath({ editPath: path, editType: type }));

    const remove = (path = editPath) => {
        dispatch(setCurrentEditPath({ editPath: null, editType: null }));
        dispatch(removeSpecAtPath({ editPath: path }));
    }

    const duplicate = (path = editPath) => {
        console.log('DUPLICATING', path)
        dispatch(duplicateSpecAtPath({ editPath: path }));
    }

    const update = (update: any, path = editPath) =>
        dispatch(setSpecAtPath({ editPath: path, update }));

    const reconcile = (update: any, path = editPath) =>
        dispatch(reconcileSpecAtPath({ editPath: path, update }));

    const move = (position: PositionPropsOptional, path = editPath) =>
        dispatch(
            reconcileSpecAtPath({
                editPath: path,
                update: { position: position }
            })
        );
    
    const reorder = (direction: 'foward'|'backward'|'toFront'|'toBack', path = editPath) => {
        dispatch(
            reorderAtSpec({
                editPath: path,
                direction
            })
        )
    }

    const manuallySetSpec = (...args: any[]) => dispatch(setSpecAtPath(...args));

    return {
        openEditor,
        remove,
        duplicate,
        update,
        reconcile,
        reorder,
        move,
        manuallySetSpec
    };
};

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
