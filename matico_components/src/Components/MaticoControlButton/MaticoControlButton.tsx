import React from "react";
import { useIsEditable } from "Hooks/useIsEditable";
import { ActionButton } from "@adobe/react-spectrum";
import Settings from "@spectrum-icons/workflow/Settings";
import Delete from "@spectrum-icons/workflow/Delete";
import Move from "@spectrum-icons/workflow/Move";
import Resize from "@spectrum-icons/workflow/Resize";
import ChevronDown from "@spectrum-icons/workflow/ChevronDown";
import ChevronRight from "@spectrum-icons/workflow/ChevronRight";
import { PaneRef } from "@maticoapp/matico_types/spec";
import { usePane } from "Hooks/usePane";

const Icons: Record<string, any> = {
    delete: Delete,
    edit: Settings,
    move: Move,
    resize: Resize,
    resizeY: ChevronDown,
    resizeX: ChevronRight
};

interface ControlButtonProps {
    paneRef: PaneRef;
    action: string;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
    paneRef,
    action
}) => {
    const { removePane, selectPane } = usePane(paneRef);

    const edit = useIsEditable();
    const Icon = Icons[action];

    if (!edit) return null;

    return (
        <ActionButton
            isQuiet
            onPress={() => {
                switch (action) {
                    case "delete":
                        removePane();
                        break;
                    case "edit":
                        selectPane();
                        break;
                    default:
                        return;
                }
            }}
        >
            <Icon />
        </ActionButton>
    );
};
