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


type MaticoOutlineViewerProps = RouteComponentProps & {
}
type MutableList = {
  name: string,
  id: string,
  type: string
  depth: number
}[]


const traversePane = (pane: Pane, mutableList: MutableList, depth: number) => {
  const {
    name,
    id,
    type,
    // @ts-ignore
    panes,
    // @ts-ignore
    layers
  } = pane;
  mutableList.push({
    name,
    id,
    type,
    depth
  })
  if (panes) {
    panes.forEach((pane: Pane) => traversePane(pane, mutableList, depth + 1))
  }
}

const traversePanes = (panes: Pane[]) => {
  let mutableList: MutableList = []
  panes.forEach(pane => traversePane(pane, mutableList, 1))
  return mutableList
}

export const MaticoOutlineViewer: React.FC = withRouter(
  (
    {
      history,
      location
    }: MaticoOutlineViewerProps
  ) => {
    // list pages
    const { pages, setEditPage, removePage } = useApp();
    const currentPage = pages.find(({ path }) => path === location.pathname);
    // list panes
    const { page, panes } = usePage(currentPage.id)
    const nestedPaneList = traversePanes(panes)
    console.log('nestedPaneList', nestedPaneList)

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

    // const handlePaneAction = (action: string, id: string) => {
    //   switch (action) {
    //     case 'edit':
    //       setEditPath(id);
    //       break;
    //     case 'duplicate':
    //       // do duplication;
    //       break;
    //     case 'delete':
    //       removePage(id);
    //       history.push('')
    //       break
    //     default:
    //       break;
    //   }
    // }

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
        <PageList
          pages={pages}
          currentPage={currentPage}
          handlePageAction={handlePageAction}
        />
        {nestedPaneList.map(pane => <p>{JSON.stringify(pane)}</p>)}

      </Flex>
    )
  });
