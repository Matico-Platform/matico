import { useMaticoDispatch, useMaticoSelector } from "./redux";

export const useIsEditable = () => {
    const canEdit = useMaticoSelector((state) => state.spec.editing);
    return canEdit;
};
