import React, { useEffect } from "react";
import _ from "lodash";
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
import { PaneCollectionEditor } from "../EditorComponents/PaneCollectionEditor/PaneCollectionEditor";
import { pageAtomFamily } from "Stores/SpecAtoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { editTargetAtom } from "Stores/StateAtoms";

export interface PageEditorProps {
    id: string;
}
export const PageEditor: React.FC = () => {
    const { id } = useRecoilValue(editTargetAtom)
    const { removePage } = usePage(id);

    const [page, setPage] = useRecoilState(pageAtomFamily(id))

    const { iconList, filterText, setFilterText, loadMoreIcons } = useIconList();

    useEffect(() => {
        if (page) {
            setFilterText(
                page?.icon?.split(" fa-")?.slice(-1)?.[0]?.replace(/-/g, " ") ||
                ""
            );
        }
    }, [page?.icon]);

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
                    onChange={(name: string) => setPage({ ...page, name })}
                />
                <TextField
                    label="Path"
                    labelPosition="side"
                    width="100%"
                    marginTop="size-50"
                    value={page.path}
                    onChange={(path: string) => setPage({ ...page, path })}
                />
                <ComboBox
                    label="Icon"
                    selectedKey={page.icon}
                    onSelectionChange={(icon: string) => setPage({ ...page, icon })}
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
                <PaneCollectionEditor containerId={page.id} />
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
