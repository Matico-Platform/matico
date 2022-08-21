import React from "react";
import _ from "lodash";
import { Flex, Text, TextField } from "@adobe/react-spectrum";

import { PaneEditor } from "./PaneEditor";
import { LayoutEditor } from "./LayoutEditor";
import { useContainer } from "Hooks/useContainer";
import { PaneRef } from "@maticoapp/matico_types/spec";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";
import { GatedAction } from "../EditorComponents/GatedAction";
import { PaneCollectionEditor } from "../EditorComponents/PaneCollectionEditor/PaneCollectionEditor";

export interface SectionEditorProps {
    paneRef: PaneRef;
}

export const ContainerPaneEditor: React.FC<SectionEditorProps> = ({
    paneRef
}) => {
    const { container, removePane, updatePane, updatePanePosition, parent } = useContainer(paneRef);

    return (
        <Flex width="100%" height="100%" direction="column">
            <CollapsibleSection title="Basic" isOpen={true}>
                <TextField
                    width="100%"
                    label="name"
                    value={container.name}
                    onChange={(name) => updatePane({ name })}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Layout" isOpen={true}>
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
                <LayoutEditor
                    name={container.name}
                    layout={container.layout}
                    updateLayout={(update) => updatePane({ layout: update })}
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
