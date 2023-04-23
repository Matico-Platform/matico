import { atomFamily, atom, useRecoilState, useSetRecoilState, useRecoilTransaction_UNSTABLE, useRecoilValue, useRecoilCallback, selectorFamily, GetRecoilValue, selector, DefaultValue } from 'recoil'
import { Page as SpecPage, Pane as SpecPane, Theme, Metadata, Dataset, App, PaneRef as SpecPaneRef, ContainerPane } from "@maticoapp/matico_types/spec"
import { v4 as uuid } from "uuid"

export type PaneRef = SpecPaneRef & { order: number, parentId: string }
export type Pane = Omit<SpecPane, "panes">
export type Page = Omit<SpecPage, "panes">

export const pageAtomFamily = atomFamily<Page, string>({
  key: "pages",
  default: () => ({
    name: "Page",
    order: 0,
    id: uuid(),
    icon: "fa-page",
    panes: [],
    path: "/",
    layout: {
      type: "free",
      allowOverflow: true
    },
  })
})

export const themeAtom = atom<Theme>({
  key: "theme",
  default: {
    primaryColor: { hex: "#ff0000" },
    secondaryColor: { hex: "#00ff00" },
    logoUrl: null
  }
})

export const metadataAtom = atom<Metadata>({
  key: "metadata",
  default: {
    name: "Some app",
    description: "Not just some app",
    createdAt: (new Date()).toUTCString()
  }
})

export const datasetsAtomFamily = atomFamily<Dataset, string>({
  key: "datasets",
  default: () => ({
    type: "csv",
    name: "dataset",
    url: "",
    latCol: null,
    lngCol: null,
    idColumn: null
  })
})

export const panesAtomFamily = atomFamily<Pane, string>({
  key: "panes",
  default: () => ({
    type: "text",
    name: "Text Pane",
    id: uuid(),
    content: "String",
    font: null,
    background: null,
  })
})

export const pageListAtom = atom<{ name: string, path: string, id: string, order: number }[]>({
  key: "pageList",
  default: []
})

export const paneRefListAtom = atom<string[]>({
  key: "pageRefList",
  default: []
})


export const maxPageOrderSelector = selector({
  key: "maxPageOrder",
  get: ({ get }) => {
    let page_refs = get(pageListAtom)
    return Math.max(...page_refs.map((pr) =>
      pr.order
    ))
  }
})

export const useAddPage = (() => {
  let pageList = useRecoilValue(pageListAtom)
  let maxPageOrder = useRecoilValue(maxPageOrderSelector)

  return useRecoilCallback(({ set }) => (page: { name: string, path: string, id: string }) => {
    let newPage: Page = {
      id: uuid(),
      icon: 'fa-page',
      name: `Page ${pageList.length + 1}`,
      path: `page_${pageList.length + 1}`,
      layout: {
        type: "free",
        allowOverflow: true
      },
      ...page,
    }

    set(pageListAtom, [...pageList, { name: newPage.name, path: newPage.path, id: newPage.id, order: maxPageOrder + 1 }])
    set(pageAtomFamily(newPage.id), newPage)

  }, [pageList])
})

export const paneRefAtomFamily = atomFamily<PaneRef, string>({
  key: "paneRef",
  default: {
    type: "map",
    id: "",
    paneId: "",
    position: {
      width: 100,
      height: 100,
      layer: 0,
      float: false,
      x: 0,
      y: 0,
      padLeft: 0,
      padRight: 0,
      padTop: 0,
      padBottom: 0,
      xUnits: "percent",
      yUnits: "percent",
      widthUnits: "percent",
      heightUnits: "percent",
      padUnitsLeft: "pixels",
      padUnitsRight: "pixels",
      padUnitsTop: "pixels",
      padUnitsBottom: "pixels",
    }
  }
})

export const useAddPaneToContainer = (containerId: string) => {
  let paneRefs = useRecoilValue(paneRefListAtom)
  return useRecoilCallback(({ set }) => (pane: Pane) => {
    let paneRefId = uuid()
    set(paneRefListAtom, [...paneRefs, paneRefId])
    set(paneRefAtomFamily(paneRefId), { type: pane.type, id: paneRefId, parentId: containerId })
    set(panesAtomFamily(pane.id), pane)
  }, [containerId, paneRefs])
}

export const paneRefsForParent = selectorFamily({
  key: "paneRefsForPage",
  get: (pageId) => ({ get }) => {
    let paneRefIds = useRecoilValue(paneRefListAtom)
    let paneRefs = paneRefIds.map((id) => get(paneRefAtomFamily(id)))
      .filter(pr => pr.parentId === pageId);
    return paneRefs
  }
})

export const parentSelector = selectorFamily<Pane, string>({
  key: "parentSelector",
  get: (paneRefId: string) => ({ get }) => {
    let paneRef = get(paneRefAtomFamily(paneRefId))
    let parent = get(panesAtomFamily(paneRef.parentId))
    return parent
  }
})

export const paneWithRefSelector = selectorFamily({
  key: "paneWithRef",
  get: (paneRefId: string) => ({ get }) => {
    let paneRef = get(paneRefAtomFamily(paneRefId))
    if (!paneRef) return null
    let pane = get(panesAtomFamily(paneRef.paneId))
    return ({ pane, paneRef })
  },
  set: (paneRefId: string,) => ({ set }, update) => {
    if (update instanceof DefaultValue) return;
    let { pane, paneRef } = update

    set(panesAtomFamily(pane.id), pane)
    set(paneRefAtomFamily(paneRefId), paneRef)

  }
})

export const useSpecAtomsSetup = () => {
  return useRecoilTransaction_UNSTABLE(({ get, set }) => (state: App) => {
    let paneRefs: Array<PaneRef> = []

    if (state.pages) {
      state.pages?.forEach((page) => {
        set(pageAtomFamily(page.id), page);
        page.panes.forEach((pane, order) => {
          paneRefs.push({ ...pane, order, parentId: page.id })
        })
      })
      set(pageListAtom, state.pages.map((page, order) => ({ id: page.id, name: page.name, path: page.path, order })))
    }

    if (state.metadata) {
      set(metadataAtom, state.metadata)
    }

    if (state.theme) {
      set(themeAtom, state.theme)
    }

    if (state.panes) {
      state.panes?.forEach((pane) => {
        if (pane.type === "container") {
          let { panes, ...rest } = pane
          set(panesAtomFamily(pane.id), rest)
          panes.forEach((paneRef, order) => paneRefs.push({ ...paneRef, order, parentId: pane.id }))
        }
        else {
          set(panesAtomFamily(pane.id), pane)
        }
      })
    }

    set(paneRefListAtom, paneRefs.map(pr => pr.id))
    paneRefs.forEach(p => set(paneRefAtomFamily(p.id), p))

    if (state.datasets) {
      state.datasets.forEach((dataset) => {
        set(datasetsAtomFamily(dataset.name), dataset)
      })
    }
  })
}


