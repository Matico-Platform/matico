import React, { useState } from "react";
import {
    Flex,
    TextField,
    Text,
    Heading,
    ActionButton,
    Content,
    Dialog,
    DialogTrigger,
    TextArea
} from "@adobe/react-spectrum";
import { useApp } from "Hooks/useApp";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";
import { ColorPickerDialog } from "../Utils/ColorPickerDialog";
import { MaticoOutlineViewer } from "./MaticoOutlineViewer";
import { useRecoilState } from "recoil";
import { metadataAtom, themeAtom } from "Stores/SpecAtoms";

interface AddPageModalProps {
    onAddPage: (pageName: string) => void;
    validatePageName?: (pageName: string) => boolean;
}

const AddPageModal: React.FC<AddPageModalProps> = ({
    onAddPage,
    validatePageName
}) => {
    const [newPageName, setNewPageName] = useState("New Page");
    const [errorText, setErrorText] = useState<string | null>(null);

    const attemptToAddPage = (pageName: string, close: () => void) => {
        if (newPageName.length === 0) {
            setErrorText("Please provide a name");
            <TextField
                label="MapBox"
                description="Required to use the application with mapbox gl tiling, geododing or routing"
                width="100%"
            />;
        }
        if (validatePageName) {
            if (validatePageName(pageName)) {
                onAddPage(pageName);
                close();
            } else {
                setErrorText(
                    "Another page with the same name exists, pick something else"
                );
            }
        } else {
            onAddPage(newPageName);
        }
    };

    return (
        <DialogTrigger type="popover" isDismissable>
            <ActionButton width="100%" isQuiet>
                Add
            </ActionButton>
            {(close: any) => (
                <Dialog>
                    <Heading>Select pane to add</Heading>
                    <Content>
                        <Flex direction="column" gap="size-150">
                            <TextField
                                label="New pane name"
                                value={newPageName}
                                onChange={setNewPageName}
                                errorMessage={errorText}
                                width="100%"
                            />
                            <ActionButton
                                onPress={() => {
                                    attemptToAddPage(newPageName, close);
                                }}
                            >
                                Add Page
                            </ActionButton>
                        </Flex>
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};

interface AppEditorProps { }

export const AppEditor: React.FC<AppEditorProps> = () => {
    const {
        addPage,
    } = useApp();

    const [theme, setTheme] = useRecoilState(themeAtom)
    const [metadata, setMetadata] = useRecoilState(metadataAtom)

    const addNewPage = (pageName: string) => {
        addPage({
            name: pageName,
            layout: { type: "free" },
            path: `/${pageName}`
        });
    };

    return (
        <Flex width="100%" height="100%" direction="column">
            <CollapsibleSection title="Theme" isOpen={true}>
                <Text>Primary Color</Text>
                <ColorPickerDialog
                    // @ts-ignore
                    color={theme?.primaryColor ?? { rgb: [113, 48, 102] }}
                    onColorChange={(color) =>
                        setTheme({ ...theme, primaryColor: color })
                    }
                />
                <Text>Secondary Color</Text>
                <ColorPickerDialog
                    // @ts-ignore
                    color={theme?.secondaryColor ?? { rgb: [48, 113, 59] }}
                    onColorChange={(color) =>
                        setTheme({ ...theme, secondaryColor: color })
                    }
                />

                <TextField
                    label="App Image URL"
                    value={theme?.logoUrl}
                    onChange={(logoUrl) => setTheme({ ...theme, logoUrl })}
                    width="100%"
                />
            </CollapsibleSection>
            <CollapsibleSection title="Metadata" isOpen={true}>
                <TextField
                    label="Name"
                    width="100%"
                    value={metadata.name}
                    onChange={(name) => setMetadata({ ...metadata, name })}
                />
                <TextArea
                    label="description"
                    width="100%"
                    value={metadata.description}
                    onChange={(description) => setMetadata({ ...metadata, description })}
                />
            </CollapsibleSection>
            {/*
            <CollapsibleSection title="Keys" isOpen={true}>
                <TextField
                    label="MapBox"
                    description="Required to use the application with mapbox gl tiling, geododing or routing"
                    width="100%"
                />
                <TextField
                    label="MapTiler"
                    description="Required to use the application with MapTiler tilesets"
                    width="100%"
                />
            </CollapsibleSection>
            */}
            {/*<CollapsibleSection title="Pages" isOpen={true}>
                <MaticoOutlineViewer showPanes={false} />
            </CollapsibleSection>
            */}
        </Flex>
    );
};
