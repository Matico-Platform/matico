import {
    Page,
    Pane,
    PanePosition,
    PaneRef,
    ContainerPane
} from "@maticoapp/matico_types/spec";
import {
    updatePaneDetails,
    removePane,
    updatePanePosition,
    findParent,
    setPaneOrder,
    setCurrentEditElement,
    removePaneRef
} from "Stores/MaticoSpecSlice";
import { useMaticoDispatch, useMaticoSelector } from "./redux";
import _ from "lodash";
import {useNormalizedSpecSelector} from "./useNormalizedSpecSelector";

export const usePane = (paneRef: PaneRef) => {
    const dispatch = useMaticoDispatch();

    const pane = useMaticoSelector((selector) =>
        selector.spec.spec.panes.find((p: Pane) => p.id == paneRef.paneId)
    );

    const normalizedPane = useNormalizedSpecSelector((selector)=>
        selector?.panes.find((p:Pane)=>p.id===paneRef.paneId) 
    )

    const parent = useMaticoSelector((selector) =>
        findParent(selector.spec.spec, paneRef.id)
    ) as Page | ContainerPane;

    // after spec update, may have a race condition 
    // and no parent is present
    if (!parent) return {};

    const currentIndex = _.indexOf(parent.panes, paneRef);

    const updatePane = (update: Partial<Pane>) => {
        dispatch(updatePaneDetails({ id: paneRef.paneId, update }));
    };

    const _updatePanePosition = (update: Partial<PanePosition>) => {
        dispatch(updatePanePosition({ paneRefId: paneRef.id, update }));
    };

    const deletePane = () => {
        dispatch(removePane({ id: paneRef.paneId }));
    };

    const removePaneFromParent = () => {
        dispatch(removePaneRef({ paneRefId: paneRef.paneId}))
    }

    const reparentPane = (newParentId: string, position?: any) => {
        // dispatch
        // ...
        //
    }

    const raisePane = () => {
        if (currentIndex < parent.panes.length) {
            dispatch(
                setPaneOrder({
                    parentId: parent.id,
                    paneRef: paneRef,
                    newIndex: currentIndex + 1
                })
            );
        }
    };

    const lowerPane = () => {
        if (currentIndex > 0) {
            dispatch(
                setPaneOrder({
                    parentId: parent.id,
                    paneRef: paneRef,
                    newIndex: currentIndex - 1
                })
            );
        }
    };

    const _setPaneOrder = (newIndex: number) => {
        let targetIndex = Math.min(newIndex, 0);
        targetIndex = Math.max(targetIndex, parent.panes.length);
        dispatch(
            setPaneOrder({
                parentId: parent.id,
                paneRef: paneRef,
                newIndex: targetIndex
            })
        );
    };
    
    const selectPane = () => {
        dispatch(
            setCurrentEditElement(
                { 
                    type: "pane", 
                    id: paneRef.id,
                    parentId: !('path' in parent) && parent.id
                }
            )
        );
    };

    return {
        pane,
        normalizedPane,
        updatePane,
        removePane: deletePane,
        removePaneFromParent,
        updatePanePosition: _updatePanePosition,
        parent,
        raisePane,
        lowerPane,
        setPaneOrder: _setPaneOrder,
        selectPane
    };
};
