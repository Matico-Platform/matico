import React from "react";
import {
    View,
    Picker,
    Item,
    Radio,
    RadioGroup,
    Flex
} from "@adobe/react-spectrum";
import { availableLayouts } from "Utils/layoutEngine";
import {
    Layout,
    LinearLayout,
    TabLayout,
    TabBarPosition,
    FreeLayout,
    LinearLayoutDirection,
    Alignment,
    Justification
} from "@maticoapp/matico_types/spec";

export interface LinearLayoutEditorProps {
    layout: LinearLayout;
    onChange: (update: Partial<LinearLayout>) => void;
}

export const LinearLayoutEditor: React.FC<LinearLayoutEditorProps> = ({
    layout,
    onChange
}) => {
    return (
        <Flex direction="column" rowGap="size-300" marginTop="size-300">
            <RadioGroup
                label="Flow direction"
                value={layout.direction}
                onChange={(val) =>
                    onChange({ direction: val as LinearLayoutDirection })
                }
            >
                <Flex direction="row">
                    <Radio value="row">Horizontal</Radio>
                    <Radio value="column">Vertical</Radio>
                </Flex>
            </RadioGroup>
            <RadioGroup
                label="Fit content to container"
                value={layout.allowOverflow ? "allow" : "noAllow"}
                onChange={(stringVal) =>
                    onChange({
                        allowOverflow: stringVal === "allow" ? true : false
                    })
                }
            >
                <Flex direction="row">
                    <Radio value={"allow"}>Overflow content</Radio>
                    <Radio value={"noAllow"}>Fit to container</Radio>
                </Flex>
            </RadioGroup>

            <Picker
                label="Gap"
                width={"100%"}
                selectedKey={layout?.gap ?? "none"}
                onSelectionChange={(gap) => onChange({ gap })}
                items={[
                    { id: "none", label: "None" },
                    { id: "small", label: "Small" },
                    { id: "medium", label: "Medium" },
                    { id: "large", label: "Large" }
                ]}
            >
                {(item) => <Item key={item.id}>{item.label}</Item>}
            </Picker>
            {!layout.allowOverflow && (
                <>
                    <RadioGroup
                        label="Flow Alignment"
                        value={layout.align}
                        onChange={(val) =>
                            onChange({ align: val as Alignment })
                        }
                    >
                        <Flex direction="row" wrap={"wrap"}>
                            <Radio value="start">Start</Radio>
                            <Radio value="center">Center</Radio>
                            <Radio value="end">End</Radio>
                            <Radio value="stretch">Stretch</Radio>
                            <Radio value="baseline">Baseline</Radio>
                        </Flex>
                    </RadioGroup>

                    <RadioGroup
                        label="Flow Justification"
                        value={layout.justify}
                        onChange={(val) =>
                            onChange({ justify: val as Justification })
                        }
                    >
                        <Flex direction="row" wrap={"wrap"}>
                            <Radio value="start">Start</Radio>
                            <Radio value="center">Center</Radio>
                            <Radio value="end">End</Radio>
                            <Radio value="space-between">Space Between</Radio>
                            <Radio value="space-around">Space Around</Radio>
                            <Radio value="space-evenly">Space Evenly</Radio>
                        </Flex>
                    </RadioGroup>
                </>
            )}
        </Flex>
    );
};

export interface TabLayoutEditorProps {
    layout: TabLayout;
    onChange: (update: Partial<TabLayout>) => void;
}

export const TabLayoutEditor: React.FC<TabLayoutEditorProps> = ({
    layout,
    onChange
}) => {
    return (
        <Flex direction="column" width="100%">
            <RadioGroup
                label="Tab bar location"
                value={layout.tabBarPosition}
                onChange={(val) =>
                    onChange({ tabBarPosition: val as TabBarPosition })
                }
            >
                <Flex direction="row" wrap={"wrap"}>
                    <Radio value="horizontal">Horizontal</Radio>
                    <Radio value="vertical">Vertical</Radio>
                </Flex>
            </RadioGroup>
        </Flex>
    );
};

export interface FreeLayoutEditorProps {
    layout: FreeLayout;
    onChange: (update: Partial<FreeLayout>) => void;
}

export const FreeLayoutEditor: React.FC<FreeLayoutEditorProps> = ({
    layout,
    onChange
}) => {
    return <></>;
};

const LayoutEditorMap = {
    linear: LinearLayoutEditor,
    free: FreeLayoutEditor,
    tabs: TabLayoutEditor
};

interface LayoutEditorProps {
    name: string;
    layout: Layout;
    updateLayout: ({ change }: { [key: string]: any }) => void;
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({
    name,
    layout,
    updateLayout
}) => {
    const Editor = LayoutEditorMap[layout.type as keyof typeof LayoutEditorMap];
    return (
        <View width="100%">
            <Picker
                width="100%"
                selectedKey={layout.type}
                label="Layout"
                onSelectionChange={(layout) =>
                    updateLayout({
                        type: layout,
                        ...availableLayouts.find((l) => l.name === layout)
                            .default
                    })
                }
            >
                {availableLayouts.map(({ name, label }) => (
                    <Item key={name}>{label}</Item>
                ))}
            </Picker>
            <Editor
                layout={layout}
                onChange={(update: Partial<Layout>) =>
                    updateLayout({ ...layout, ...update })
                }
            />
        </View>
    );
};
