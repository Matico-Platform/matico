import React from "react";
import { MaticoPaneInterface } from "Components/Panes/Pane";
import {
    Flex,
    Text,
    NumberField,
    Picker,
    ActionGroup,
    View,
    Grid,
    Divider,
    Item
} from "@adobe/react-spectrum";

import { TwoUpCollapsableGrid } from "../Utils/TwoUpCollapsableGrid";
import TextStyle from "@spectrum-icons/workflow/TextStyle";
import {
    Layout,
    ScreenUnits,
    PanePosition
} from "@maticoapp/matico_types/spec";

interface PaneEditorProps extends MaticoPaneInterface {
    onChange: (update: PanePosition) => void;
    parentLayout: Layout;
}

interface PositionUnitEditorProps {
    label: string;
    value: number;
    units: ScreenUnits;
    onValueChange: (value: number) => void;
    onUnitsChange: (units: ScreenUnits) => void;
}

const PositionUnitEditor: React.FC<PositionUnitEditorProps> = ({
    label,
    value,
    units,
    onValueChange,
    onUnitsChange
}) => {
    return (
        <Grid
            areas={["Label Interface"]}
            columns={["33.3%", "66.6%"]}
            gap="size-50"
        >
            <Text gridArea={"Label"} alignSelf="center" justifySelf="end">
                {label}
            </Text>
            <View gridArea={"Interface"} marginTop="size-100">
                <View
                    backgroundColor="gray-75"
                    borderColor="gray-400"
                    borderWidth="thin"
                >
                    <Flex direction="row" marginX="size-100">
                        <NumberField
                            value={value}
                            onChange={onValueChange}
                            hideStepper
                            isQuiet
                        />
                        <Picker
                            selectedKey={units}
                            onSelectionChange={onUnitsChange}
                            aria-label={`${label} units`}
                            isQuiet
                        >
                            <Item key="percent">%</Item>
                            <Item key="pixels">px</Item>
                        </Picker>
                    </Flex>
                </View>
            </View>
        </Grid>
    );
};

export const PositionPresets = [
    {
        id: "full",
        label: "▣ Full",
        position: {
            x: 0,
            y: 0,
            width: 100,
            height: 100
        }
    },
    {
        id: "half-l",
        label: "◧ Snap Left",
        position: {
            x: 0,
            y: 0,
            width: 50,
            height: 100
        }
    },
    {
        id: "half-r",
        label: "◨ Snap Right",
        position: {
            x: 50,
            y: 0,
            width: 50,
            height: 100
        }
    },
    {
        id: "quad-t-l",
        label: "◰ Snap Top Left",
        position: {
            x: 0,
            y: 50,
            width: 50,
            height: 50
        }
    },
    {
        id: "quad-t-r",
        label: "◳ Snap Top Right",
        position: {
            x: 50,
            y: 50,
            width: 50,
            height: 50
        }
    },
    {
        id: "quad-b-l",
        label: "◱ Snap Bottom Left",
        position: {
            x: 0,
            y: 0,
            width: 50,
            height: 50
        }
    },
    {
        id: "quad-b-r",
        label: "◲ Snap Bottom Right",
        position: {
            x: 50,
            y: 0,
            width: 50,
            height: 50
        }
    }
];

export const SnapPaneMenu: React.FC<{ updatePosition: (change: any) => void }> = ({
    updatePosition
}) => {
    return (
        <ActionGroup
            overflowMode="collapse"
            marginTop={"size-150"}
            summaryIcon={<TextStyle />}
            aria-label="Text style"
            maxWidth="20vw"
            isEmphasized
            onAction={(key) => {
                const position = PositionPresets.find(
                    (f) => f.id === key
                )?.position;
                !!position &&
                    updatePosition({
                        ...position,
                        heightUnits: "percent",
                        widthUnits: "percent",
                        xUnits: "percent",
                        yUnits: "percent"
                    });
            }}
        >
            {PositionPresets.map(({ id, label }) => (
                <Item key={id} textValue={label.slice(2)}>
                    <Text>{label}</Text>
                </Item>
            ))}
        </ActionGroup>
    );
};

export const PaneEditor: React.FC<PaneEditorProps> = ({
    position,
    onChange,
    parentLayout
}) => {
    const isLinearLayout = parentLayout.type === "linear";
    const isFreeLayout = parentLayout.type === "free";

    const updatePosition = (change: Partial<PanePosition>) => {
        onChange({ ...position, ...change });
    };

    return (
        <Flex direction="column" width="100%" height="100%">
            {isFreeLayout && (
                <React.Fragment>
                    <Text>Size and Position</Text>
                    <TwoUpCollapsableGrid>
                        <PositionUnitEditor
                            label="Left"
                            value={position.x}
                            units={position.xUnits}
                            onValueChange={(x) => updatePosition({ x })}
                            onUnitsChange={(xUnits) =>
                                updatePosition({ xUnits })
                            }
                        />
                        <PositionUnitEditor
                            label="Top"
                            value={position.y}
                            units={position.yUnits}
                            onValueChange={(y) => updatePosition({ y })}
                            onUnitsChange={(yUnits) =>
                                updatePosition({ yUnits })
                            }
                        />
                    </TwoUpCollapsableGrid>
                </React.Fragment>
            )}
            <TwoUpCollapsableGrid>
                <PositionUnitEditor
                    label="width"
                    value={position.width}
                    units={position.widthUnits}
                    onValueChange={(width) => updatePosition({ width })}
                    onUnitsChange={(widthUnits) =>
                        updatePosition({ widthUnits })
                    }
                />
                <PositionUnitEditor
                    label="height"
                    value={position.height}
                    units={position.heightUnits}
                    onValueChange={(height) => updatePosition({ height })}
                    onUnitsChange={(heightUnits) =>
                        updatePosition({ heightUnits })
                    }
                />
            </TwoUpCollapsableGrid>
            {isFreeLayout && <SnapPaneMenu {...{ updatePosition }} />}

            <Divider size="M" marginY="size-150" />
            <Text>Padding</Text>
            <TwoUpCollapsableGrid>
                <PositionUnitEditor
                    label="Top"
                    value={position.padTop}
                    units={position.padUnitsTop}
                    onValueChange={(padTop) => updatePosition({ padTop })}
                    onUnitsChange={(padUnitsTop) =>
                        updatePosition({ padUnitsTop })
                    }
                />
                <PositionUnitEditor
                    label="Bottom"
                    value={position.padBottom}
                    units={position.padUnitsBottom}
                    onValueChange={(padBottom) => updatePosition({ padBottom })}
                    onUnitsChange={(padUnitsBottom) =>
                        updatePosition({ padUnitsBottom })
                    }
                />
            </TwoUpCollapsableGrid>
            <TwoUpCollapsableGrid>
                <PositionUnitEditor
                    label="Left"
                    value={position.padLeft}
                    units={position.padUnitsLeft}
                    onValueChange={(padLeft) => updatePosition({ padLeft })}
                    onUnitsChange={(padUnitsLeft) =>
                        updatePosition({ padUnitsLeft })
                    }
                />
                <PositionUnitEditor
                    label="Right"
                    value={position.padRight}
                    units={position.padUnitsRight}
                    onValueChange={(padRight) => updatePosition({ padRight })}
                    onUnitsChange={(padUnitsRight) =>
                        updatePosition({ padUnitsRight })
                    }
                />
            </TwoUpCollapsableGrid>
        </Flex>
    );
};
