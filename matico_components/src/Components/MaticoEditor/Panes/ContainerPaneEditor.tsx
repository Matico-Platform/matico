import React from "react";
import _ from "lodash";
import { Flex, Text } from "@adobe/react-spectrum";

import { RowEntryMultiButton } from "../Utils/RowEntryMultiButton";
import { PaneEditor } from "./PaneEditor";
import { SectionLayoutEditor } from "./SectionLayoutEditor";
import { useContainer } from "Hooks/useContainer";
import { Pane, PaneRef } from "@maticoapp/matico_types/spec";
import { IconForPaneType } from "../Utils/PaneDetails";
import { NewPaneDialog } from "../EditorComponents/NewPaneDialog/NewPaneDialog";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";
import { GatedAction } from "../EditorComponents/GatedAction";
import {PaneCollectionEditor} from "../EditorComponents/PaneCollectionEditor/PaneCollectionEditor";

export interface SectionEditorProps {
    paneRef: PaneRef;
}

export const ContainerPaneEditor: React.FC<SectionEditorProps> = ({
    paneRef
}) => {
    const {
        container,
        removePane,
        updatePane,
        updatePanePosition,
        parent,
    } = useContainer(paneRef);

    return (
        <Flex width="100%" height="100%" direction="column">
            <CollapsibleSection title="Size" isOpen={true}>
                <PaneEditor
                    position={paneRef.position}
                    name={container.name}
                    background={"white"}
                    onChange={updatePanePosition}
                    parentLayout={parent.layout}
                    id={paneRef.id}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Container Layout" isOpen={true}>
                <SectionLayoutEditor
                    name={container.name}
                    layout={container.layout}
                    updateSection={updatePane}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Panes" isOpen={true}>
              <PaneCollectionEditor containerId={paneRef.paneId} />
            </CollapsibleSection>
            <CollapsibleSection title="Danger Zone">
                <GatedAction
                    buttonText="Delete this pane"
                    confirmText={`Are you sure you want to delete ${container.name}?`}
                    confirmButtonText="Delete Page"
                    onConfirm={removePane}
                    confirmBackgroundColor="negative"
                />
            </CollapsibleSection>
        </Flex>
    );
};
