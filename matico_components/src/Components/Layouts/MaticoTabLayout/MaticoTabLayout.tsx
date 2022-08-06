import React from "react";
import { PaneRef, TabBarPosition } from "@maticoapp/matico_types/spec";
import {
    View,
    Flex,
    Tabs,
    TabList,
    TabPanels,
    Item
} from "@adobe/react-spectrum";
import { ControlActionBar } from "Components/MaticoEditor/Utils/ControlActionBar";
import { PaneSelector } from "Utils/paneEngine";
import { useMaticoSelector } from "Hooks/redux";
import { usePaneContainer } from "Hooks/usePaneContainer";

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

export const MaticoTabLayout: React.FC<MaticoTabLayoutInterface> = ({
    paneRefs,
    tabBarPosition
}) => {
  const  panes  = useMaticoSelector((spec)=> paneRefs.map( pr => spec.spec.spec.panes.find((p)=>pr.paneId === p.id)));
    const tabs: Array<{ id: string; name: string }> = paneRefs.map((pr, i) => ({
        id: pr.id,
        name: panes[i].name
    }));

    return (
        <Tabs width="100%" height="100%" orientation={tabBarPosition} arial-label="Tabs" items={tabs}>
            <TabList>
                {(item) => <Item key={item.id}>{item.name}</Item>}
            </TabList>
            <TabPanels>
                {(item) => (
                    <Item key={item.id}>
                        <PaneSelector
                          paneRef={paneRefs.find((p) => p.id === item.id)}
                        />
                    </Item>
                )}
            </TabPanels>
        </Tabs>
    );
};
