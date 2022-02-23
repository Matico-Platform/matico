import React, { useState } from "react";
import styled from "styled-components";
import { Box } from "grommet";
import { PanePosition } from "@maticoapp/matico_spec";
import {
  DndContext,
  useDraggable,
  useDndMonitor,
  useSensor,
  KeyboardSensor,
  PointerSensor,
  useSensors,
} from "@dnd-kit/core";
import { View } from "@adobe/react-spectrum";
import { useMaticoDispatch } from "Hooks/redux";
import { setSpecAtPath } from "Stores/MaticoSpecSlice";

const FreeArea = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1;
`;

const cssUnits: Record<"Percent" | "Pixels", string> = {
  Percent: "%",
  Pixels: "px",
};

interface MaticoFreeLayoutInterface {
  editPath: string;
}

const FreePane: React.FC<{
  editPath: string;
  pane: PanePosition;
  name: string;
}> = ({ pane, name, children, editPath }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform: activeTransform,
  } = useDraggable({
    id: name,
  });

  const [dragOffset, setDragOffset] =
    useState<null | { x: number; y: number }>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const dispatch = useMaticoDispatch();

  useDndMonitor({
    onDragStart: (e) => {
      if (e.active.id === name) {
        setDragging(true);
      }
    },
    onDragMove: (e) => {
      if (e.active.id === name) {
        console.log("SETTING OFFSET ", e.delta);
        setDragOffset(e.delta);
      }
    },
    onDragEnd: (e) => {
      if (e.active.id === name) {
        dispatch(
          setSpecAtPath({
            editPath,
            update: {
              location: {
                ...pane,
                x: pane.x + e.delta.x,
                y: pane.y + e.delta.y,
              },
            },
          })
        );
        setDragOffset(null);
        setDragging(false);
      }
    },
  });

  const baseTranslate = `translate3d(${pane.x}${cssUnits[pane.x_units]}, ${
    pane.y
  }${cssUnits[pane.y_units]}, 0)`;

  const totalTranslate = dragOffset
    ? `${baseTranslate} translate3d(${dragOffset.x}px, ${dragOffset.y}px,0)`
    : baseTranslate;

  const baseStyle = {
    width: `${pane.width}${cssUnits[pane.width_units]}`,
    height: `${pane.height}${cssUnits[pane.height_units]}`,
    position: "absolute",
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...baseStyle,
        transform: totalTranslate,
        border: dragging ? "1px solid red" : "none",
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};

export const MaticoFreeLayout: React.FC<MaticoFreeLayoutInterface> = ({
  children,
  editPath,
}) => {
  const keyboardSensor = useSensor(KeyboardSensor);
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 1000,
      tolerance: 4,
    },
  });
  const sensors = useSensors(keyboardSensor, pointerSensor);
  return (
    <FreeArea>
      <DndContext sensors={sensors}>
        {React.Children.map(children, (child, index) => {
          //@ts-ignore
          //TODO Make this properly typed. Properly check to ensure that the child nodes implement MaticoPaneInterface
          const pane = (
            <FreePane
              key={child.props.name}
              name={child.props.name}
              pane={child.props.position}
              editPath={child.props.editPath}
            >
              {child}
            </FreePane>
          );

          //@ts-ignore
          return child.props.float ? <Draggable>{pane}</Draggable> : pane;
        })}
      </DndContext>
    </FreeArea>
  );
};
