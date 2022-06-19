
import { View, Flex, Tabs, DialogContainer, ActionGroup, Item, DialogTrigger, Dialog, ButtonGroup, Button, TabPanels, TabList, Text } from "@adobe/react-spectrum";
import React, { useRef, useState } from "react";
import { NavigatorBarProps } from "./types";
import Layers from '@spectrum-icons/workflow/Layers'
import Pattern from '@spectrum-icons/workflow/Pattern'
import Curate from '@spectrum-icons/workflow/Curate'
import Data from '@spectrum-icons/workflow/Data'
import Channel from '@spectrum-icons/workflow/Channel'
import DocumentOutline from '@spectrum-icons/workflow/DocumentOutline'
import { MaticoRawSpecEditor } from "Components/MaticoEditor/Panes/MaticoRawSpecEditor";
import { MaticoStateViewer } from "Components/MaticoEditor/Panes/MaticoStateViewer";
import { useMaticoSelector } from "Hooks/redux"
import { DatasetsEditor } from "Components/MaticoEditor/Panes/DatasetsEditor";
import { MaticoOutlineViewer } from "Components/MaticoEditor/Panes/MaticoOutlineViewer";
import { Editors } from "Components/MaticoEditor/Editors";
import { AppEditor } from "Components/MaticoEditor/Panes/AppEditor";

const panelSizes = [
    {
        icon: '|',
        size: 10
    },
    {
        icon: '||',
        size: 20
    },
    {
        icon: '|||',
        size: 40
    },
    {
        icon: '||||',
        size: 60
    }
]

export const NavigatorBar: React.FC<NavigatorBarProps> = ({
    datasetProviders
}) => {
    const [showPanel, setShowPanel] = useState<boolean>(true);

    const togglePanel = () => setShowPanel(p => !p)
    const { spec, currentEditPath, currentEditType } = useMaticoSelector(
        (state) => state.spec
    );

    // @ts-ignore
    const EditPane = currentEditPath ? Editors[currentEditType] : AppEditor;
    return <View position="relative" maxHeight="100vh" overflow="visible" paddingTop="3em">
        <Tabs
            aria-labelledby="label-3"
            orientation="vertical">

            <TabList>
                <Item key="components"><Pattern size="XL" /></Item>
                <Item key="outline"><Layers size="XL" /></Item>
                <Item key="datasets"><Data size="L" /></Item>
                <Item key="dataviews"><Curate size="L" /></Item>
                <Item key="state"><Channel size="L" /></Item>
                <Item key="spec"><DocumentOutline size="L" /></Item>
            </TabList>
            <View
                position="absolute"
                left="100%"
                top="3em"
                height="calc(100vh - 3em)"
                overflow="hidden"
                minWidth={`20em`}
                zIndex={500}

            >
                <View
                    position="relative"
                    width="100%"
                    height="100%"
                    overflow="hidden auto"
                    backgroundColor={"gray-75"}
                    UNSAFE_style={{
                        resize: 'horizontal'
                    }}
                >
                    <TabPanels
                        width="100%"
                        height="calc(100% - 2em)"
                    >
                        <Item key="datasets"> <DatasetsEditor datasetProviders={datasetProviders} /></Item>
                        <Item key="outline"> <MaticoOutlineViewer /></Item>
                        <Item key="spec"> <MaticoRawSpecEditor /></Item>
                        <Item key="state"> <MaticoStateViewer /></Item>
                        <Item key="dataviews"> <p>Data views, coming soon...</p></Item>
                        <Item key="components"> <EditPane editPath={currentEditPath} /></Item>
                    </TabPanels>
                </View>
            </View>

        </Tabs>
    </View>

}