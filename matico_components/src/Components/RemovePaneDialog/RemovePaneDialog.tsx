import React from "react";
import {
    Well,
    Heading,
    DialogTrigger,
    ActionButton,
    Dialog,
    Content,
    Button
} from "@adobe/react-spectrum";

export const RemovePaneDialog: React.FC<{ deletePane: () => void }> = ({
    deletePane
}) => {
    return (
        <Well>
            <Heading>Remove this pane</Heading>
            <DialogTrigger isDismissable type="popover">
                <ActionButton>Remove</ActionButton>
                <Dialog>
                    <Heading>Are you sure?</Heading>
                    <Content>
                        <Button
                            variant="negative"
                            onPress={deletePane}
                            marginY={"size-100"}
                        >
                            Remove
                        </Button>
                    </Content>
                </Dialog>
            </DialogTrigger>
        </Well>
    );
};
