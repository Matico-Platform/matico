import React, { useState } from "react";
import { ActionButton, ActionGroup, Button, ButtonGroup, Content, Dialog, DialogTrigger, Flex, Heading, Item, Text, View } from "@adobe/react-spectrum";
import { useAppSpec } from "Hooks/useAppSpec";
import { RowEntryMultiButton, RowEntryMultiButtonProps } from "../Utils/RowEntryMultiButton";
import { isArray, isObject, remove } from 'lodash'
import { useApp } from "Hooks/useApp";
import { ContainerPane, Page, Pane, PaneRef } from "@maticoapp/matico_types/spec";
import { usePage } from "Hooks/usePage";
import Checkmark from '@spectrum-icons/workflow/Checkmark'
import Settings from "@spectrum-icons/workflow/Settings";
import Duplicate from "@spectrum-icons/workflow/Duplicate";
import { GatedAction } from "../EditorComponents/GatedAction";
import Delete from "@spectrum-icons/workflow/Delete";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from "styled-components";
import { usePane } from "Hooks/usePane";
import { Container } from "react-dom";
import { useContainer } from "Hooks/useContainer";
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import DragHandle from '@spectrum-icons/workflow/DragHandle';
import { NewPaneDialog } from "../EditorComponents/NewPaneDialog/NewPaneDialog";

// function addForContainer(container: ContainerPane, inset: number) {
//   let containerPanes: Array<RowEntryMultiButtonProps> = [];

//   rowComponents.push(
//     {
//       entryName: page.name,
//       inset: inset,
//       compact: true,
//       onSelect: () => setEditPage(page.id),
//       onRemove: () => removePage(page.id),
//       onRaise: () => { },
//       onLower: () => { },
//       onDuplicate: () => { }
//     }

//   )
//   inset += 1
// }

const HoverableItem = styled.span`
  opacity:0;
  transition:125ms opacity;
`

const HoverableRow = styled.span`
  &:hover ${HoverableItem} {
    opacity:1;
  }
`

const DragButton = styled.button`
  background:none;
  border:none;
  padding:0;
  cursor: grab;
`

const DragContainer = styled.div`
  transition: 250ms box-shadow;
`
interface PageListProps {
  pages: Page[],
  currentPage: Page,
  handlePageAction: (action: string, id: string) => void
}

const PageList: React.FC<PageListProps> = ({
  pages,
  currentPage,
  handlePageAction
}) => {
  return (
    <View
      borderBottomColor="gray-300"
      borderBottomWidth='thick'
      paddingX="size-150"
    >
      <Flex direction="column">
        {pages.map(({ name, id }, i) => (
          <HoverableRow>
            <Flex
              direction="row"
              justifyContent="space-between"
            >
              <View
                key={`page-button-${i}`}
                backgroundColor={name === currentPage?.name ? 'gray-200' : undefined}
              >
                <Button
                  variant="primary"
                  onPress={() => handlePageAction('edit', id)}
                  isQuiet
                >
                  <Text UNSAFE_style={{ paddingRight: '.5em' }}>
                    {name}
                  </Text>
                  {name === currentPage?.name && <Checkmark color="informative" size="XS" />}
                </Button>
              </View>
              <HoverableItem>
                <Flex direction="row">
                  {/* <ActionGroup
              onAction={(action: string) => handlePageAction(action, id)}
              buttonLabelBehavior="hide"
              isQuiet
            >
              <Item key="duplicate">
                <Duplicate />
                <Text>Duplicate</Text>
              </Item>
            </ActionGroup> */}
                  <DialogTrigger
                    isDismissable
                    type="popover"
                    mobileType="tray"
                    placement="right top"
                    containerPadding={1}
                  >
                    <ActionButton
                      isQuiet
                    >
                      <Delete />
                    </ActionButton>
                    {(close) => (
                      <Dialog
                        width="auto"
                      >
                        <Heading>Delete {name}?</Heading>
                        <Content marginTop="size-100">
                          <Button
                            variant="negative"
                            onPress={() => {
                              handlePageAction('delete', id)
                              close()
                            }}
                          >
                            <Delete /> Delete
                          </Button>
                        </Content>
                      </Dialog>
                    )}
                  </DialogTrigger>
                </Flex>
              </HoverableItem>
            </Flex>
          </HoverableRow>
        ))}
      </Flex>
    </View>
  )
}

const PaneRow: React.FC<{ rowPane: PaneRef }> = ({
  rowPane
}) => {
  const {
    pane,
    updatePane,
    removePane,
    updatePanePosition,
    parent,
    raisePane,
    lowerPane,
    setPaneOrder,
    selectPane
  } = usePane(rowPane);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: pane.id,
    data: {
      pane,
      parent
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    background: 'var(--spectrum-global-color-static-gray-900)',
    boxShadow: '0px 0px 10px var(--spectrum-global-color-fuchsia-400)',
    cursor: 'grabbing',
    zIndex: 500
    
  } : undefined;

  return <HoverableRow>
    <DragContainer style={style} ref={setNodeRef}>
      <Flex direction="row">
        <DragButton  {...listeners} {...attributes}>
          <DragHandle />
        </DragButton>
        <Button
          variant="primary"
          onPress={selectPane}
          isQuiet
          UNSAFE_style={{
            borderRadius: 0,
            color: 'var(--spectrum-global-color-gray-900)',
            textAlign: 'left',
            justifyContent: 'flex-start'
          }}
        >
          {pane.name}
        </Button>
        <Button 
          variant="secondary"
          isQuiet
          onPress={removePane}
          >
            delete
        </Button>
      </Flex>
    </DragContainer>
  </HoverableRow>
}

const ContainerPaneRow: React.FC<{
  rowPane: PaneRef
}> = ({
  rowPane
}) => {
    const { pane } = usePane(rowPane);
    const { addPaneToContainer } = useContainer(rowPane);
    const { panes } = pane as ContainerPane;

    return <>
      <PaneRow
        rowPane={rowPane}
      />
      <PaneList
        panes={panes}
        addPaneRefToParent={addPaneToContainer}
        id={pane.id}
      />
    </>
  }


const PaneList: React.FC<{
  panes: PaneRef[],
  addPaneRefToParent: (paneRef: PaneRef, index?: number) => void,
  id?: string
}> = ({
  panes,
  addPaneRefToParent,
  id
}) => {
    const { isOver, setNodeRef } = useDroppable({
      id: id || 'droppable',
      data: {
        id
      }
    });
    const style = {
      border: isOver ? '1px solid var(--spectrum-global-color-fuchsia-400)' : '1px solid rgba(0,0,0,0)',
      background: isOver ? 'var(--spectrum-global-color-static-gray-800)' : undefined,
      transition: '250ms all'
    };

    return (
      <div ref={setNodeRef} style={style}>
        <View
          borderStartColor={"gray-500"}
          borderStartWidth={"thick"}
          marginStart="size-50"
        >
        <NewPaneDialog
          validatePaneName={() => true}
          onAddPane={addPaneRefToParent}
          />
          {
            panes.map(pane => {
              if (pane.type === 'container') {
                return <ContainerPaneRow
                  rowPane={pane}
                />
              } else {
                return <PaneRow
                  rowPane={pane}
                />
              }
            })
          }
        </View>
      </div>)
  }

type MaticoOutlineViewerProps = RouteComponentProps & {}
type MutableList = {
  name: string,
  id: string,
  type: string
  depth: number
}[]

export const MaticoOutlineViewer: React.FC = withRouter(
  (
    {
      history,
      location
    }: MaticoOutlineViewerProps
  ) => {
    // list pages
    const { pages, panes: allPanes, reparentPane, setEditPage, removePage } = useApp();
    const currentPage = pages.find(({ path }) => path === location.pathname);
    if (!currentPage) {
      return null
    }
    const { panes, id, name: pageName } = currentPage;
    // list panes

    const handlePageAction = (action: string, id: string) => {
      switch (action) {
        case 'edit':
          setEditPage(id);
          const pagePath = pages.find(({ id: pageId }) => pageId === id)?.path;
          history.push(pagePath)
          break;
        case 'duplicate':
          // do duplication;
          break;
        case 'delete':
          removePage(id);
          history.push('')
          break
        default:
          break;
      }
    }
    const handleDragEnd = (e: any) => {
      const {
        over: {
          id
        },
        active: {
          data: {
            current: {
              pane,
              parent
            }
          }
        }
      } = e;
      
      const target = id === 'droppable' 
        ? currentPage 
        : allPanes.find((p: Pane) => p.id === id)

      reparentPane(
        pane,
        parent,
        target
      )
    }
    return (
      <Flex
        direction="column"
      >
        <Heading
          margin="size-150"
          alignSelf="start"
        >
          Page Outline
        </Heading>
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
          <PageList
            pages={pages}
            currentPage={currentPage}
            handlePageAction={handlePageAction}
          />
          <Heading
            margin="size-150"
            alignSelf="start"
            level={4}
          >
            {pageName}
          </Heading>
          <PaneList panes={panes} />
        </DndContext>
      </Flex>
    )
  });
