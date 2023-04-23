import { Flex, Text } from "@adobe/react-spectrum";
import { PaneDetails, PaneRef } from "@maticoapp/matico_types/spec";
import {
  Tree,
  getBackendOptions,
  MultiBackend,
  NodeModel,
} from "@minoru/react-dnd-treeview";
import React from 'react'
import { DndProvider } from "react-dnd";
import { GetRecoilValue, selectorFamily, useRecoilState } from "recoil";
import { pageListAtom, paneRefAtomFamily, paneRefListAtom, panesAtomFamily } from "Stores/SpecAtoms";
import { editTargetAtom } from "Stores/StateAtoms";
import styled from "styled-components";
import { HoverableRow } from "./MaticoOutlineViewer/Styled";

type NodeType = {
  type: string,
  order: number,
} & Partial<PaneDetails>

export const hierarchyTreeSelector = selectorFamily<NodeModel<NodeType>[], string | null>({
  key: "hierarchyTreeSelector",
  get: (baseId: string | null) => ({ get }) => {
    let pages = get(pageListAtom)
    let paneRefs = get(paneRefListAtom)

    let nodes: NodeModel<NodeType>[] = []

    pages.forEach((page, order) => {
      nodes.push({
        "id": page.id,
        "parent": 0,
        "droppable": true,
        "text": page.name,
        "data": { type: "page", ...page, order }
      })
    })

    paneRefs.forEach((paneRefId) => {
      let paneRef = get(paneRefAtomFamily(paneRefId))
      let pane = get(panesAtomFamily(paneRef.paneId))
      nodes.push({
        "id": pane.id,
        "parent": paneRef.parentId,
        "droppable": true,
        "text": pane.name,
        "data": { ...paneRef }
      })
    })
    return nodes
  },
  set: (baseId: string | null) => ({ set }, newTree: NodeModel<NodeType>[]) => {

    const pageNodes = newTree.filter(n => n.data.type === 'page').sort((a: NodeModel<NodeType>, b: NodeModel<NodeType>) => a.data.order > b.data.order ? 1 : -1).map((n: NodeModel<NodeType>) => {
      let { type, order, ...rest } = n.data
      return rest
    });

    const paneNodes = newTree.filter(n => n.data.type !== 'page')

    paneNodes.forEach((node) => {
      set(paneRefAtomFamily(node.data.id), { ...node.data, parentId: node.parent })
    })

    // console.log("Page Nodes ", pageNodes);
    console.log("PaneRef Nodes ", paneNodes);
    //
    // set(pageListAtom, pageNodes)


    // set(pageListAtom, pageNodes)

  }
})

const TreeStyles = styled.div`
  .container{
    list-style:none;
    padding-left:10px;
  } 
  li{
      padding: 10px, 0px;
      box-sizing:border-box;
    }
`

export const MaticoOverviewTree: React.FC<{ baseId: string | null }> = () => {

  const [treeData, setTreeData] = useRecoilState(hierarchyTreeSelector(null));
  const [editTarget, setEditTarget] = useRecoilState(editTargetAtom);
  let NodeTree = Tree<NodeType>

  const nodeSelected = (node: NodeModel<NodeType>) => {
    setEditTarget({ id: node.data.id, parentId: node.parent as string, type: node.data.type === 'page' ? "page" : "pane" })
  }

  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <TreeStyles>
        <NodeTree
          tree={treeData}
          rootId={0}
          onDrop={setTreeData}
          //@ts-ignore
          sort={(a, b) => a.data.order > b.data.order ? 1 : -1}
          initialOpen={true}
          classes={
            { container: "container" }
          }
          render={(node, { isOpen, onToggle }) => (
            <HoverableRow onClick={() => nodeSelected(node)}>
              <Flex direction='row'>
                <Text
                  UNSAFE_style={{
                    padding: "0 .5em",
                    fontWeight: "bold",
                    color: editTarget.id === node.data.id ? "green" : "white"
                  }}
                >
                  {["page", "container"].includes(node.data.type) && (
                    <span onClick={onToggle}>{isOpen ? "[-]" : "[+]"}</span>
                  )}
                  {node.text}
                </Text>
              </Flex>
            </HoverableRow>
          )}
        />
      </TreeStyles>
    </DndProvider>
  )
}
