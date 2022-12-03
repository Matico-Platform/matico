import React from "react";
import {
    PanePosition,
    PaneRef,
    TabBarPosition
} from "@maticoapp/matico_types/spec";
import {
    Tabs,
    TabList,
    TabPanels,
    Item,
    Flex,
    Text,
    View
} from "@adobe/react-spectrum";
import { PaneSelector } from "Utils/paneEngine";
import { useMaticoSelector } from "Hooks/redux";
import { InternalSpecProvider } from "Hooks/useInteralSpec";
import { useIsEditable } from "Hooks/useIsEditable";
import { usePane } from "Hooks/usePane";
import Alert from "@spectrum-icons/workflow/Alert";
export interface MaticoTabLayoutInterface {
    paneRefs: Array<PaneRef>;
    tabBarPosition: TabBarPosition;
}

const GapVals = {
    none: "size-0",
    small: "size-100",
    medium: "size-600",
    large: "size-1000"
};

const TabPane: React.FC<{ paneRef: PaneRef }> = ({ paneRef }) => {
    const paneType = paneRef.type;
    const {
        normalizedPane,
        pane,
        updatePane,
        selectPane,
        updatePanePosition,
        parent
    } = usePane(paneRef);
    const isEdit = useIsEditable();
    // const Wrapper = isEdit ? FreeDraggableActionWrapper : FreeContainer;
    return (
        <InternalSpecProvider
            value={{
                position: {
                    ...paneRef.position,
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    xUnits: "percent",
                    yUnits: "percent",
                    widthUnits: "percent",
                    heightUnits: "percent"
                } as PanePosition,
                paneRef,
                normalizedPane,
                updatePane,
                selectPane,
                updatePanePosition,
                parent
            }}
        >
            {/* <Wrapper> */}
            <PaneSelector
                normalizedPane={normalizedPane}
                updatePane={updatePane}
                selectPane={selectPane}
                paneRef={paneRef}
                paneType={paneType}
            />
            {/* </Wrapper> */}
        </InternalSpecProvider>
    );
};

export const MaticoTabLayout: React.FC<MaticoTabLayoutInterface> = ({
    paneRefs,
    tabBarPosition
}) => {
    const panes = useMaticoSelector((spec) =>
        paneRefs.map((pr) =>
            spec.spec.spec.panes.find((p) => pr.paneId === p.id)
        )
    );
    const tabs: Array<{ id: string; name: string }> = paneRefs.map((pr, i) => ({
        id: pr.id,
        name: panes[i].name
    }));

    if (tabs.length === 0) {
        return (
            <Flex
                width="100%"
                height="100%"
                justifyContent="center"
                alignItems="center"
                UNSAFE_style={{ background: "white" }}
            >
                <Text
                    UNSAFE_style={{
                        color: "var(--spectrum-global-color-magenta-400)",
                        textAlign: "center"
                    }}
                >
                    <Alert size="L" />
                    <br />
                    No tabs defined. Add a subpane to this container to add it
                    as a tab
                    <br />
                    <i>Click to open editor</i>
                </Text>
            </Flex>
        );
    }

    return (
        <Tabs
            width="100%"
            height="100%"
            orientation={tabBarPosition}
            arial-label="Tabs"
            items={tabs}
        >
            <TabList>
                {(item) => <Item key={item.id}>{item.name}</Item>}
            </TabList>
            <View width="100%" height="100%" position={"relative"}>
                <TabPanels flex={1} width="100%" height="100%">
                    {(item) => (
                        <Item key={item.id}>
                            <TabPane
                                paneRef={paneRefs.find((p) => p.id === item.id)}
                            />
                        </Item>
                    )}
                </TabPanels>
            </View>
        </Tabs>
    );
};
