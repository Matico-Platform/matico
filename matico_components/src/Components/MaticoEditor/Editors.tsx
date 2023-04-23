import React from 'react'
import { useRecoilState, useRecoilValue } from "recoil";
import { editTargetAtom } from "Stores/StateAtoms";
import { Pane, paneWithRefSelector } from "Stores/SpecAtoms";
import { PaneDefs } from "Panes"
import { CollapsibleSection } from './EditorComponents/CollapsibleSection';
import { TextField } from '@adobe/react-spectrum';

export const PaneNameAndLayoutEditor: React.FC<{ paneRefId: string }= ({ paneRefId }) => {
    let [{ pane, paneRef }, updatePanePair] = useRecoilState(paneWithRefSelector(paneRefId))

    const updatePane = (update: Partial<Pane>) => {
        updatePanePair({ paneRef, pane: { ...pane, ...update } })
    }

    return (
        <>
            <CollapsibleSection title="Basic" isOpen={true}>
                <TextField
                    width="100%"
                    label="name"
                    value={pane.name}
                    onChange={(name) => updatePane({ name })}
                />
            </CollapsibleSection>

            <CollapsibleSection title="Layout" isOpen={true}>
                <PaneEditor
                    position={paneRef.position}
                    name={categorySelectorPane.name}
                    background={"white"}
                    onChange={(change) => updatePanePosition(change)}
                    parentLayout={parent.layout}
                    id={paneRef.id}
                />
            </CollapsibleSection>
        </>
    )

}

export const PaneEditor: React.FC = () => {
    let editTarget = useRecoilValue(editTargetAtom)
    let { pane } = useRecoilValue(paneWithRefSelector(editTarget.id))
    let Editor = PaneDefs[pane.type].sidebarPane
    return (
        <>
            <PaneNameAndLayoutEditor paneRefId={editTarget.id} />
            <Editor />
        </>)
}

