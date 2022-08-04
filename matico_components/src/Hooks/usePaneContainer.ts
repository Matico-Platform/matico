import {
    Page,
    Pane,
    PanePosition,
    PaneRef,
    ContainerPane
} from "@maticoapp/matico_types/spec";
import {
    addPane,
    addPaneRefToContainer,
    removePaneRefFromContainer
} from "Stores/MaticoSpecSlice";
import { useMaticoDispatch, useMaticoSelector } from "./redux";
import _ from "lodash";
import {DefaultPosition} from "Components/MaticoEditor/Utils/PaneDetails";
import {v4 as uuidv4} from 'uuid'

export const usePaneContainer = (containerId: string) => {
    const dispatch = useMaticoDispatch();

    const spec  = useMaticoSelector(s=>s.spec.spec)
    const container : Page | ContainerPane = useMaticoSelector((selector) =>
        selector.spec.spec.panes.find((p: Pane) => p.id == containerId && p.type==='container') as ContainerPane

        || selector.spec.spec.pages.find( (p:Page) => p.id ==containerId)     );


    const panes  = useMaticoSelector((selector)=> container.panes.map((paneRef: PaneRef)=>selector.spec.spec.panes.find((pane:Pane)=>pane.id === paneRef.paneId)))
    

    // const raisePane = () => {
    //     if (currentIndex < container?.panes.length) {
    //         dispatch(
    //             setPaneOrder({
    //                 parentId: parent.id,
    //                 paneRef: paneRef,
    //                 newIndex: currentIndex + 1
    //             })
    //         );
    //     }
    // };

    // const lowerPane = () => {
    //     if (currentIndex > 0) {
    //         dispatch(
    //             setPaneOrder({
    //                 parentId: parent.id,
    //                 paneRef: paneRef,
    //                 newIndex: currentIndex - 1
    //             })
    //         );
    //     }
    // };

    // const _setPaneOrder = (newIndex: number) => {
    //     let targetIndex = Math.min(newIndex, 0);
    //     targetIndex = Math.max(targetIndex, parent.panes.length);
    //     dispatch(
    //         setPaneOrder({
    //             parentId: parent.id,
    //             paneRef: paneRef,
    //             newIndex: targetIndex
    //         })
    //     );
    // };
    
    // const selectPane = () => {
    //     dispatch(
    //         setCurrentEditElement(
    //             { 
    //                 type: "pane", 
    //                 id: paneRef.id,
    //                 parentId: !('path' in parent) && parent.id
    //             }
    //         )
    //     );
    // };
    //
    //
    const _addPaneRefToContainer= (paneRef: PaneRef, index?: number) => {
        dispatch(
            addPaneRefToContainer({
                containerId: containerId,
                paneRef: paneRef,
                index: index
            })
        );
    };

    const _removePaneRefFromContainer= (paneRefId: string) => {
        dispatch(
            removePaneRefFromContainer({
                containerId: containerId,
                paneRefId: paneRefId,
            })
        );
    };


    const addPaneToContainer= (pane: Pane) => {
        dispatch(addPane({ pane }));
        const paneRef = {
            id: uuidv4(),
            paneId: pane.id,
            type: pane.type,
            position: DefaultPosition
        };
        //@ts-ignore not sure why we are getting this error pane.type and paneRef.type should have the same set of entries
        _addPaneRefToContainer(paneRef);
    };



    return {
      container,
      panes,
      paneRefs: container.panes,
      addPaneToContainer: addPaneToContainer,
      addPaneRefToContainer: _addPaneRefToContainer,
      removePaneRefFromContainer: _removePaneRefFromContainer
    };
};
