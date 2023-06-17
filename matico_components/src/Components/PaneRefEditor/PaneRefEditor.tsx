import React from "react";
import {
    Flex,
    Text,
    ActionGroup,
    Divider,
    Item
} from "@adobe/react-spectrum";

import { TwoUpCollapsableGrid } from "../TwoUpCollapsableGrid/TwoUpCollapsableGrid";
import TextStyle from "@spectrum-icons/workflow/TextStyle";
import {
    PanePosition
} from "@maticoapp/matico_types/spec";
import { useRecoilState, useRecoilValue } from "recoil";
import { paneRefAtomFamily, parentSelector } from "Stores/SpecAtoms";
import { PositionPresets } from "./PositionPresets";
import {PositionUnitEditor} from "./PositionUnitEditor"

interface PaneRefEditorProps {
    paneRefId: string
}


export const SnapPaneMenu: React.FC<{
    updatePosition: (change: any) => void;
}> = ({ updatePosition }) => {
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

export const PaneRefEditor: React.FC<PaneRefEditorProps> = ({
    paneRefId
}) => {

    let [paneRef, updatePaneRef] = useRecoilState(paneRefAtomFamily(paneRefId))
    let parent = useRecoilValue(parentSelector(paneRefId))
    let { position } = paneRef

    const isLinearLayout = parent.layout.type === "linear";
    const isFreeLayout = parent.layout.type === "free";

    const updatePosition = (change: Partial<PanePosition>) => {
        updatePaneRef({ ...paneRef, position: { ...paneRef.position, ...change } });
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
                    label="Width"
                    value={position.width}
                    units={position.widthUnits}
                    onValueChange={(width) => updatePosition({ width })}
                    onUnitsChange={(widthUnits) =>
                        updatePosition({ widthUnits })
                    }
                />
                <PositionUnitEditor
                    label="Height"
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

