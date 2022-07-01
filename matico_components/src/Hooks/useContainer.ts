import { ContainerPane, PaneRef, Pane } from "@maticoapp/matico_types/spec";
import { useMaticoDispatch, useMaticoSelector } from "./redux";
import {
    setCurrentEditElement,
    removePaneRefFromContainer
} from "Stores/MaticoSpecSlice";
import { usePane } from "./usePane";
import { v4 as uuidv4 } from "uuid";
import { DefaultPosition } from "Components/MaticoEditor/Utils/PaneDetails";
import {usePaneContainer} from "./usePaneContainer";

export const useContainer = (paneRef: PaneRef) => {
    const paneProperties = usePane(paneRef);
    const { pane } = paneProperties;
    const dispatch = useMaticoDispatch();
    const {paneRefs, addPaneToContainer, addPaneRefToContainer, removePaneRefFromContainer} = usePaneContainer(paneRef.paneId)

    const container =
        pane.type === "container"
            ? (paneProperties.pane as ContainerPane)
            : null;

    const subPanes = useMaticoSelector((selector) =>
        container?.panes.map((paneRef: PaneRef) =>
            selector.spec.spec.panes.find(
                (pane: Pane) => pane.id === paneRef.paneId
            )
        )
    );


    const selectSubPane = (subPane: PaneRef) => {
        dispatch(
            setCurrentEditElement({
                id: subPane.id,
                parentId: pane.id,
                type: "pane"
            })
        );
    };


    return {
        ...paneProperties,
        container,
        addPaneToContainer,
        removePaneFromContainer: removePaneRefFromContainer,
        selectSubPane,
        subPanes
    };
};
