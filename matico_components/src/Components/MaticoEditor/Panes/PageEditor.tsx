import React from "react";
import _ from "lodash";
import "react-mde/lib/styles/css/react-mde-all.css";
import {
    ComboBox,
    Flex,
    Item,
    TextField,
    View,
    Text
} from "@adobe/react-spectrum";

import { useIconList } from "Hooks/useIconList";
import { usePage } from "Hooks/usePage";
import { GatedAction } from "../EditorComponents/GatedAction";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";

export interface PageEditorProps {
    id: string;
}
export const PageEditor: React.FC<PageEditorProps> = ({ id }) => {
    const { page, updatePage, removePage } = usePage(id);

    const { iconList, filterText, setFilterText, loadMoreIcons } =
        useIconList();

    if (!page) {
        return (
            <View>
                <Text>Something went wrong. We could not find that page</Text>
            </View>
        );
    }
    return (
        <Flex width="100%" height="100%" direction="column">
            <CollapsibleSection title="Page Details" isOpen={true}>
                <TextField
                    label="Name"
                    labelPosition="side"
                    width="100%"
                    marginTop="size-50"
                    value={page.name}
                    onChange={(name: string) => updatePage({ name })}
                />
                <TextField
                    label="Path"
                    labelPosition="side"
                    width="100%"
                    marginTop="size-50"
                    value={page.path}
                    onChange={(path: string) => updatePage({ path })}
                />
                <ComboBox
                    label="Icon"
                    selectedKey={page.icon}
                    onSelectionChange={(icon: string) => updatePage({ icon })}
                    labelPosition="side"
                    width="100%"
                    marginTop="size-50"
                    items={iconList}
                    inputValue={filterText}
                    onInputChange={setFilterText}
                    onLoadMore={loadMoreIcons}
                >
                    {({ id, name }) => (
                        <Item>
                            <Text>
                                <i
                                    className={id}
                                    style={{ marginRight: "1em" }}
                                />
                                {name}
                            </Text>
                        </Item>
                    )}
                </ComboBox>
            </CollapsibleSection>

            <CollapsibleSection title="Panes" isOpen={true}>
                <Flex gap={"size-200"} direction="column">
                    {panes.map((pane:PaneRef) => {
                        let [paneType, paneSpecs] = Object.entries(pane)[0];
                        return (
                            <RowEntryMultiButton
                                key={paneSpecs.name}
                                entryName={
                                    <Flex
                                        direction="row"
                                        alignItems="center"
                                        gap="size-100"
                                    >
                                        {IconForPaneType(paneType)}
                                        <Text>{paneSpecs.name}</Text>
                                    </Flex>
                                }
                                editPath={`${editPath}.panes.${index}.${paneType}`}
                                editType={paneType}
                            />
                        );
                    })}
                </Flex>
            </CollapsibleSection>

            <CollapsibleSection title="Danger Zone" isOpen={true}>
                <GatedAction
                    buttonText="Delete this page"
                    confirmText={`Are you sure you want to delete ${page.name}?`}
                    confirmButtonText="Delete Page"
                    onConfirm={removePage}
                    confirmBackgroundColor="negative"
                />
            </CollapsibleSection>
        </Flex>
    );
};
