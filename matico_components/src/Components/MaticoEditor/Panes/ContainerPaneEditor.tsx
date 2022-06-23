import React from "react";
import _ from "lodash";
import {
    Heading,
    Flex,
    Well,
    Text,
} from "@adobe/react-spectrum";

import { RowEntryMultiButton } from "../Utils/RowEntryMultiButton";
import { PaneEditor } from "./PaneEditor";
import { SectionLayoutEditor } from "./SectionLayoutEditor";
import { useContainer } from "Hooks/useContainer";
import { RemovePaneDialog } from "../Utils/RemovePaneDialog";
import { Pane, PaneRef } from "@maticoapp/matico_types/spec";
import { IconForPaneType } from "../Utils/PaneDetails";
import {NewPaneDialog} from "../EditorComponents/NewPaneDialog/NewPaneDialog";

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
        addPaneToContainer,
        removePaneFromContainer,
        subPanes,
        selectSubPane
    } = useContainer(paneRef);

    return (
        <Flex width="100%" height="100%" direction="column">
            <PaneEditor
                position={paneRef.position}
                name={container.name}
                background={"white"}
                onChange={updatePanePosition}
                parentLayout={parent.layout}
                id={paneRef.id}
            />
            <SectionLayoutEditor
                name={container.name}
                layout={container.layout}
                updateSection={updatePane}
            />
            <Well>
                <Heading>
                    <Flex
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Text>Panes</Text>

                        <NewPaneDialog onAddPane={addPaneToContainer} />
                    </Flex>
                </Heading>
                <Flex gap={"size-200"} direction="column">
                    {subPanes.map((pane: Pane, index: number) => {
                        return (
                            <RowEntryMultiButton
                                // @ts-ignore
                                key={pane.name}
                                entryName={
                                    <Flex
                                        direction="row"
                                        alignItems="center"
                                        gap="size-100"
                                    >
                                        {IconForPaneType(pane.type)}
                                        {/* @ts-ignore */}
                                        <Text>{pane.name}</Text>
                                    </Flex>
                                }
                                onRemove={() =>
                                    removePaneFromContainer(
                                        container.panes[index]
                                    )
                                }
                                onRaise={() => {}}
                                onLower={() => {}}
                                onDuplicate={() => {}}
                                onSelect={() =>
                                    selectSubPane(container.panes[index])
                                }
                            />
                        );
                    })}
                </Flex>
            </Well>
            <RemovePaneDialog deletePane={removePane} />
        </Flex>
    );
};
