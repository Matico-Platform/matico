import React, { useState } from 'react';
import { Styles, TabProps } from './TabStyles';

interface TabsProps {
    onTabSelected?: (tab: string) => void;
    activeTab?: string;
    children?: React.ReactElement<TabProps>[];
}

interface TabHeadProps {
    active: boolean;
    name: string;
    onSelect: (name: string) => void;
}

const TabHeader: React.FC<TabHeadProps> = ({
    active,
    name,
    onSelect,
}) => {
    return (
        <Styles.Tab onClick={() => onSelect(name)} active={active}>
            {name}
        </Styles.Tab>
    );
};

export const Tab: React.FC<TabProps> = ({ children, name }) => (
    <div key={name}>{children}</div>
);

export const Tabs: React.FC<TabsProps> = ({
    onTabSelected,
    activeTab,
    children,
}) => {
    let firstTab: string | undefined = undefined;

    if (children && children.length <= 1) {
        throw new Error('Need to have at least 2 tabs');
    } else if (children) {
        firstTab = children[0].props.name;
    }
    const [internalActiveTab, setInternalActiveTab] = useState<
        string | undefined
    >(activeTab ? activeTab : firstTab);

    const selected = (name: string) => {
        if (onTabSelected) {
            onTabSelected(name);
        }
        setInternalActiveTab(name);
    };

    const selectedTab = activeTab ? activeTab : internalActiveTab;
    const headers = children?.map((c) => (
        <TabHeader
            key={c.props.name}
            onSelect={selected}
            active={c.props.name === selectedTab}
            name={c.props.name}
        />
    ));

    const activeChild = children?.find(
        (c) => c.props.name === selectedTab,
    );
    console.log('active child is ', activeChild);

    return (
        <Styles.TabContainer>
            <Styles.TabHeader>{headers}</Styles.TabHeader>
            {activeChild}
        </Styles.TabContainer>
    );
};
