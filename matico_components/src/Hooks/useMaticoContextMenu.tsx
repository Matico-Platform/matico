import { Page, PaneRef } from "@maticoapp/matico_types/spec";
import React, { useMemo } from "react";
import {
    Menu,
    Item,
    Separator,
    Submenu,
    useContextMenu,
    TriggerEvent
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { createPortal } from "react-dom";
import { usePane } from "Hooks/usePane";
import { Flex } from "@adobe/react-spectrum";
import {
    AvaliablePanes,
    IconForPaneType,
    PaneDefaults
} from "Components/PaneDetails/PaneDetails";
import { v4 as uuidv4 } from "uuid";
import { usePaneContainer } from "./usePaneContainer";
import { PositionPresets } from "Components/PaneRefEditor";
import LayersBackward from "@spectrum-icons/workflow/LayersBackward";
import LayersBringToFront from "@spectrum-icons/workflow/LayersBringToFront";
import LayersForward from "@spectrum-icons/workflow/LayersForward";
import LayersSendToBack from "@spectrum-icons/workflow/LayersSendToBack";
import ChevronRight from "@spectrum-icons/workflow/ChevronRight";
import ChevronDoubleRight from "@spectrum-icons/workflow/ChevronDoubleRight";
import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";
import ChevronDoubleLeft from "@spectrum-icons/workflow/ChevronDoubleLeft";
// const findClosestParentId = (e) => {
//     let result;
//     let current = e.target;
//     let flag = true;
//     let counter = 0;
//     while (flag) {
//         counter++
//         if (current?.dataset?.id) {
//             result = current;
//             flag = false;
//         } else if (!current?.parentNode) {
//             flag = false;
//             result = null
//         } else {
//             current = current.parentNode;
//         }
//     }
//     return result?.dataset?.id
// }

const getDirectionText = (
    layoutType: string,
    direction: string
): {
    raise: string;
    raiseToFront: string;
    lower: string;
    lowerToBack: string;

    lowerIcon: typeof LayersBackward;
    lowerToBackIcon: typeof LayersBackward;
    raiseIcon: typeof LayersBackward;
    raiseToFrontIcon: typeof LayersBackward;
} => {
    if (layoutType === "free") {
        return {
            raise: "Send backwards",
            raiseIcon: LayersBackward,
            raiseToFront: "Send to back",
            raiseToFrontIcon: LayersSendToBack,
            lower: "Bring forwards",
            lowerIcon: LayersForward,
            lowerToBack: "Bring to front",
            lowerToBackIcon: LayersBringToFront
        };
    } else if (layoutType === "linear") {
        if (direction === "row") {
            return {
                raise: "Move right",
                raiseIcon: ChevronRight,
                raiseToFront: "Send to end",
                raiseToFrontIcon: ChevronDoubleRight,
                lower: "Move left",
                lowerIcon: ChevronLeft,
                lowerToBack: "Bring to start",
                lowerToBackIcon: ChevronDoubleLeft
            };
        } else {
            return {
                raise: "Move down",
                raiseIcon: LayersBackward,
                raiseToFront: "Send to bottom",
                raiseToFrontIcon: LayersSendToBack,
                lower: "Move up",
                lowerIcon: LayersForward,
                lowerToBack: "Bring to top",
                lowerToBackIcon: LayersBringToFront
            };
        }
    } else if (layoutType === "tabs") {
        return {
            raise: "Move right",
            raiseIcon: ChevronRight,
            raiseToFront: "Send to end",
            raiseToFrontIcon: ChevronDoubleRight,
            lower: "Move left",
            lowerIcon: ChevronLeft,
            lowerToBack: "Bring to start",
            lowerToBackIcon: ChevronDoubleLeft
        };
    }
    return {
        raise: "Move down",
        raiseIcon: LayersBackward,
        raiseToFront: "Send to bottom",
        raiseToFrontIcon: LayersSendToBack,
        lower: "Move up",
        lowerIcon: LayersForward,
        lowerToBack: "Bring to top",
        lowerToBackIcon: LayersBringToFront
    };
};

const PaneContextItems: React.FC<{ paneRef: PaneRef }> = ({ paneRef }) => {
    const {
        removePaneFromParent,
        // updatePane,
        selectPane,
        raisePane,
        raisePaneToFront,
        lowerPane,
        lowerPaneToBack,
        updatePanePosition,
        normalizedPane,
        parent
    } = usePane(paneRef);
    const {
        layout: {
            type,
            // @ts-ignore
            direction
        }
    } = parent;

    const DirectionContent = getDirectionText(type, direction);
    const hasSiblings = parent?.panes?.length > 1;
    const handleSnap = (position: {
        x: number;
        width: number;
        height: number;
        y: number;
    }) => {
        updatePanePosition({
            ...position,
            heightUnits: "percent",
            widthUnits: "percent",
            xUnits: "percent",
            yUnits: "percent"
        });
    };
    return (
        <>
            <Item disabled>
                <Flex direction="row">{normalizedPane.name}</Flex>
            </Item>
            {type === "free" && (
                <Submenu label="Snap pane to...">
                    {PositionPresets.map((preset) => (
                        <Item onClick={() => handleSnap(preset.position)}>
                            {preset.label}
                        </Item>
                    ))}
                </Submenu>
            )}
            <Separator />
            <Item onClick={selectPane}>Edit</Item>
            {type === "linear" ? (
                <>
                    <Item onClick={lowerPane} disabled={!hasSiblings}>
                        <DirectionContent.lowerIcon
                            UNSAFE_style={{
                                maxWidth: "1em",
                                marginRight: "0.5em"
                            }}
                        />
                        {DirectionContent.lower}
                    </Item>
                    <Item onClick={lowerPaneToBack} disabled={!hasSiblings}>
                        <DirectionContent.lowerToBackIcon
                            UNSAFE_style={{
                                maxWidth: "1em",
                                marginRight: "0.5em"
                            }}
                        />
                        {DirectionContent.lowerToBack}
                    </Item>
                    <Item onClick={raisePane} disabled={!hasSiblings}>
                        <DirectionContent.raiseIcon
                            UNSAFE_style={{
                                maxWidth: "1em",
                                marginRight: "0.5em"
                            }}
                        />
                        {DirectionContent.raise}
                    </Item>
                    <Item onClick={raisePaneToFront} disabled={!hasSiblings}>
                        <DirectionContent.raiseToFrontIcon
                            UNSAFE_style={{
                                maxWidth: "1em",
                                marginRight: "0.5em"
                            }}
                        />
                        {DirectionContent.raiseToFront}
                    </Item>
                </>
            ) : (
                <>
                    <Item onClick={raisePane} disabled={!hasSiblings}>
                        <DirectionContent.raiseIcon
                            UNSAFE_style={{
                                maxWidth: "1em",
                                marginRight: "0.5em"
                            }}
                        />
                        {DirectionContent.raise}
                    </Item>
                    <Item onClick={raisePaneToFront} disabled={!hasSiblings}>
                        <DirectionContent.raiseToFrontIcon
                            UNSAFE_style={{
                                maxWidth: "1em",
                                marginRight: "0.5em"
                            }}
                        />
                        {DirectionContent.raiseToFront}
                    </Item>
                    <Item onClick={lowerPane} disabled={!hasSiblings}>
                        <DirectionContent.lowerIcon
                            UNSAFE_style={{
                                maxWidth: "1em",
                                marginRight: "0.5em"
                            }}
                        />
                        {DirectionContent.lower}
                    </Item>
                    <Item onClick={lowerPaneToBack} disabled={!hasSiblings}>
                        <DirectionContent.lowerToBackIcon
                            UNSAFE_style={{
                                maxWidth: "1em",
                                marginRight: "0.5em"
                            }}
                        />
                        {DirectionContent.lowerToBack}
                    </Item>
                </>
            )}
            <Separator />
            <Submenu label="Delete">
                <Item disabled>Are you sure?</Item>
                <Item onClick={removePaneFromParent} style={{ color: "red" }}>
                    Yes, delete.
                </Item>
            </Submenu>
            <ContainerContextItems
                id={parent.id}
                type={"path" in parent ? "Page" : "Container"}
            />
        </>
    );
};

const ContainerContextItems: React.FC<{ id: string; type: string }> = ({
    id,
    type
}) => {
    const { addPaneToContainer } = usePaneContainer(id);

    const attemptToAddPane = (paneType: string, paneLabel: string) => {
        addPaneToContainer({
            ...PaneDefaults[paneType],
            id: uuidv4(),
            name: `New ${paneLabel}`,
            //@ts-ignore
            type: paneType
        });
    };

    return (
        <>
            <Submenu label={`Add Pane to ${type}`}>
                {AvaliablePanes.map(({ sectionTitle, panes }) => (
                    <>
                        <Item disabled>{sectionTitle}</Item>
                        {panes.map(({ name, label }) => (
                            <Item onClick={() => attemptToAddPane(name, label)}>
                                {IconForPaneType(name, {
                                    color: "positive",
                                    UNSAFE_style: {
                                        maxWidth: "1em",
                                        marginRight: "0.5em"
                                    }
                                })}
                                {label}
                            </Item>
                        ))}
                    </>
                ))}
            </Submenu>
        </>
    );
};

export const useMaticoContextMenu = ({
    element
}: {
    element: PaneRef | Page;
}) => {
    const id = element.id;
    const type = element && "type" in element ? element?.type : "page";

    const { show } = useContextMenu({
        id: id
    });
    function displayMenu(e: TriggerEvent) {
        show(e);
    }

    const contextMenuInner = useMemo(() => {
        // if (type === "page") {
        //     return <PageContextItems id={id} />;
        // }
        // if (type === "container") {
        //     return <ContainerContextItems paneRef={element as PaneRef} />;
        // }
        return <PaneContextItems paneRef={element as PaneRef} />;
    }, [type, id]);

    const ContextMenu = () =>
        createPortal(
            <Menu id={id} theme="dark" animation="none">
                {contextMenuInner}
            </Menu>,
            document.body
        );

    return {
        ContextMenu,
        displayMenu
    };
};
