import React from "react";
import _ from "lodash";
import { Flex } from "@adobe/react-spectrum";

import { PaneRef } from "@maticoapp/matico_types/spec";
import { LayoutEditor } from "Components/MaticoEditor/Panes/LayoutEditor";
import { CollapsibleSection } from "Components/MaticoEditor/EditorComponents/CollapsibleSection";
import { PaneCollectionEditor } from "Components/MaticoEditor/EditorComponents/PaneCollectionEditor/PaneCollectionEditor";
import { GatedAction } from "Components/MaticoEditor/EditorComponents/GatedAction";
import { useRecoilState } from "recoil";
import { panesAtomFamily } from "Stores/SpecAtoms";
import { ContainerPane } from "@maticoapp/matico_types/spec"

export interface SectionEditorProps {
    paneRef: PaneRef;
}

export const ContainerPaneEditor: React.FC<SectionEditorProps> = ({
    paneRef
}) => {
    const [pane, setPane] = useRecoilState(panesAtomFamily(paneRef.paneId))

    const removePane = () => {
        throw Error("Remove Pane not implemented yet")
    }

    if (pane.type !== 'container') throw Error("Pane is not of the correct type")
    let container = pane as Omit<ContainerPane, 'panes'> & { type: string }


    return (
        <Flex width="100%" height="100%" direction="column">
            <CollapsibleSection title="Container Layout" isOpen={true}>
                <LayoutEditor
                    name={container.name}
                    layout={container.layout}
                    //@ts-ignore
                    updateLayout={(update) => setPane({ ...container, layout: update })}
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
