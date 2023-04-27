import React from "react";
import _ from "lodash";
import {
    Flex,
    Picker,
    Item,
    TextField,
    ActionButton
} from "@adobe/react-spectrum";
import { usePane } from "Hooks/usePane";
import { PaneRef, SwitchesPane } from "@maticoapp/matico_types/spec";
import { CollapsibleSection } from "Components/MaticoEditor/EditorComponents/CollapsibleSection";
import { PaneEditor } from "Components/MaticoEditor/Panes/PaneEditor";

export interface PaneEditorProps {
    paneRef: PaneRef;
}

export const SwitchesPaneEditor: React.FC<PaneEditorProps> = ({ paneRef }) => {
    const { pane, updatePane, parent, updatePanePosition } = usePane(paneRef);

    const switches = pane as SwitchesPane;

    console.log("Switches are ", switches);

    return (
        <Flex direction="column">
            <CollapsibleSection title="Basic" isOpen={true}>
                <TextField
                    width="100%"
                    label="name"
                    value={switches.name}
                    onChange={(name) => updatePane({ name })}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Layout" isOpen={true}>
                <PaneEditor
                    position={paneRef.position}
                    name={switches.name}
                    background={"white"}
                    onChange={(change) => updatePanePosition(change)}
                    parentLayout={parent.layout}
                    id={paneRef.id}
                />
            </CollapsibleSection>
            <CollapsibleSection title="Options" isOpen={true}>
                {switches.options.map((name: string) => (
                    <Flex direction="row">
                        <TextField
                            value={name}
                            onChange={(newVal) =>
                                updatePane({
                                    options: switches.options.map((o: string) =>
                                        o !== name ? o : newVal
                                    )
                                })
                            }
                        />
                        <ActionButton
                            onPress={() =>
                                updatePane({
                                    options: switches.options.filter(
                                        (o: string) => o !== name
                                    )
                                })
                            }
                        >
                            Delete
                        </ActionButton>
                    </Flex>
                ))}
                <ActionButton
                    onPress={() =>
                        updatePane({
                            options: [...switches.options, "New Option"]
                        })
                    }
                >
                    Add Option
                </ActionButton>
            </CollapsibleSection>

            <CollapsibleSection title="Misc" isOpen={true}>
                <Picker
                    selectedKey={switches.orientation}
                    onSelectionChange={(orientation) =>
                        updatePane({ orientation })
                    }
                    items={[
                        { id: "row", name: "Row" },
                        { key: "column", name: "Column" }
                    ]}
                >
                    {(item: { id: string; name: string }) => (
                        <Item key={item.id}>{item.name}</Item>
                    )}
                </Picker>
            </CollapsibleSection>
        </Flex>
    );
};
