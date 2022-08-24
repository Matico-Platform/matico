import {
    View,
    Tabs,
    Item,
    TabPanels,
    TabList,
    Button,
    Flex
} from "@adobe/react-spectrum";
import React, { useState } from "react";
import { NavigatorBarProps } from "./types";
import Breakdown from "@spectrum-icons/workflow/Breakdown";
import Data from "@spectrum-icons/workflow/Data";
import Channel from "@spectrum-icons/workflow/Channel";
import Alert from "@spectrum-icons/workflow/Alert";
import DocumentOutline from "@spectrum-icons/workflow/DocumentOutline";
import { MaticoRawSpecEditor } from "Components/MaticoEditor/Panes/MaticoRawSpecEditor";
import { MaticoStateViewer } from "Components/MaticoEditor/Panes/MaticoStateViewer";
import { DatasetsEditor } from "Components/MaticoEditor/Panes/DatasetsEditor";
import { MaticoOutlineViewer } from "Components/MaticoEditor/Panes/MaticoOutlineViewer";
import {useErrors} from "Hooks/useErrors";
import {ErrorPanel} from "../ErrorPanel/ErrorPanel";

export const NavigatorBar: React.FC<NavigatorBarProps> = ({
    datasetProviders
}) => {
    const [showPanel, setShowPanel] = useState<boolean>(false);
    const handleShowPanel = () => setShowPanel(true);
    const handleHidePanel = () => setShowPanel(false);
    const {errors} = useErrors()

    return (
        <Flex direction="column" height="100%">
            <View
                position="relative"
                height="calc(100% - 3em)"
                overflow="visible"
                paddingTop="3em"
                UNSAFE_style={{
                    boxSizing: 'border-box'
                }}
            >
                <Tabs
                    aria-labelledby="label-3"
                    orientation="vertical"
                    onSelectionChange={handleShowPanel}
                >
                    <TabList>
                        <Item key="outline">
                            <Breakdown size="XL" />
                        </Item>
                        <Item key="datasets">
                            <Data size="L" />
                        </Item>
                        <Item key="state">
                            <Channel size="L" />
                        </Item>
                        <Item key="errors">
                          <Alert color={errors.length > 0 ? 'notice' : 'positive'} size="L" />
                        </Item>
                        <Item key="spec">
                            <DocumentOutline size="L" />
                        </Item>
                    </TabList>
                    <View
                        position="absolute"
                        left="100%"
                        height="100%"
                        overflow="hidden"
                        minWidth={`20em`}
                        zIndex={500}
                        UNSAFE_style={{
                            pointerEvents: showPanel ? "all" : "none"
                        }}
                    >
                        {showPanel && (
                            <View
                                position="relative"
                                width="100%"
                                height="100%"
                                overflow="hidden auto"
                                padding="size-50"
                                UNSAFE_style={{
                                    resize: "horizontal",
                                    backgroundColor: "rgba(26,26,26,0.95)",
                                    backdropFilter: `blur(2px)`,
                                    boxSizing: "border-box"
                                }}
                            >
                                <TabPanels
                                    width="100%"
                                    height="calc(100% - 2em)"
                                >
                                    <Item key="datasets">
                                        <DatasetsEditor
                                            datasetProviders={datasetProviders}
                                        />
                                    </Item>
                                    <Item key="outline">
                                        <MaticoOutlineViewer />
                                    </Item>
                                    <Item key="spec">
                                        <MaticoRawSpecEditor />
                                    </Item>
                                    <Item key="state">
                                        <MaticoStateViewer />
                                    </Item>
                                    <Item key="errors">
                                      <ErrorPanel />
                                    </Item>
                                </TabPanels>
                                <Button
                                    onPress={handleHidePanel}
                                    variant="primary"
                                    isQuiet
                                    position="absolute"
                                    top=".375em"
                                    right="0px"
                                    aria-label="Close panel"
                                    UNSAFE_style={{
                                        minWidth: 0,
                                        fontSize: "2em"
                                    }}
                                >
                                    &times;
                                </Button>
                            </View>
                        )}
                    </View>
                </Tabs>
            </View>
        </Flex>
    );
};
