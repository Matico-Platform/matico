import { atom } from "recoil";

export type EditElement = {
  id?: string;
  parentId?: string;
  type: "page" | "pane" | "metadata" | "dataset" | "dataview" | "layer";
};

export const editTargetAtom = atom<EditElement | null>({
  key: "selectedEditAtom",
  default: null
})

export const isEditingAtom = atom<boolean>({
  key: "isEditing",
  default: false
})
