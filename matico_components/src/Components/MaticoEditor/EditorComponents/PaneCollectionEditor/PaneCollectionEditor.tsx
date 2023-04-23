import { Flex, View, Text } from "@adobe/react-spectrum";
import { Pane, PaneRef } from "@maticoapp/matico_types/spec";
import { IconForPaneType } from "Components/MaticoEditor/Utils/PaneDetails";
import { RowEntryMultiButton } from "Components/MaticoEditor/Utils/RowEntryMultiButton";
import { usePane } from "Hooks/usePane";
import { paneRefsForParent } from "Stores/SpecAtoms"
import React from "react";
import { useRecoilValue } from "recoil";
import { NewPaneDialog } from "../NewPaneDialog/NewPaneDialog";

export interface PaneCollectionEditorProps {
    containerId: string;
}

export const PaneRefButton: React.FC<{ paneRef: PaneRef }> = ({ paneRef }) => {
    const { pane, selectPane, removePaneFromParent } = usePane(paneRef);

    return (
        <RowEntryMultiButton
            key={paneRef.id}
            onRaise={() => { }}
            onSelect={selectPane}
            onLower={() => { }}
            onRemove={removePaneFromParent}
            onDuplicate={() => { }}
            entryName={
                <Flex direction="row" alignItems="center" gap="size-100">
                    {IconForPaneType(paneRef.type)}
                    <Text>{pane.name}</Text>
                </Flex>
            }
        />
    );
};

export const PaneCollectionEditor: React.FC<PaneCollectionEditorProps> = ({
    containerId
}) => {

    const paneRefs = useRecoilValue(paneRefsForParent(containerId))

    return (
        <Flex gap={"size-200"} width="100%" direction="column">
            {paneRefs.map((paneRef: PaneRef, index: number) => (
                <PaneRefButton paneRef={paneRef} key={index} />
            ))}
            <NewPaneDialog containerId={containerId} />
        </Flex>
    );
};
