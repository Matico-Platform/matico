import { atom, atomFamily, selectorFamily } from "recoil";
import { MaticoStateVariable } from "./VariableTypes";

export type EditElement = {
  id?: string;
  parentId?: string;
  type: "page" | "pane" | "metadata" | "dataset" | "dataview" | "layer";
};

export const editTargetAtom = atom<EditElement | null>({
  key: "selectedEditAtom",
  default: { type: "metadata" }
})

export const isEditingAtom = atom<boolean>({
  key: "isEditing",
  default: false
})

export const variableIdListAtom = atom<Array<string>>({
  key: "variableIds",
  default: []
})

export const variableAtomFamily = atomFamily<MaticoStateVariable, string>({
  key: "variables",
  default: {
    id: "",
    paneId: "",
    name: "",
    type: 'string',
    value: ""
  }
})


