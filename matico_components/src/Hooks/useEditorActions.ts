import { useMaticoDispatch, useMaticoSelector } from "./redux";
import { setHoveredRef } from "Stores/editorSlice";

export const useEditorActions = (id?: string) => {
    const dispatch = useMaticoDispatch();
    const currentHoveredRef = useMaticoSelector(
        (state) => state.editor.hoveredRef
    );
    const setHovered = (refId?: string) => {
        const ref = refId !== undefined ? refId : id;
        ref !== currentHoveredRef && dispatch(setHoveredRef(ref));
    };

    return {
        setHovered
    };
};
