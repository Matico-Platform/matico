import { findParentContainer } from "Components/MaticoEditor/Utils/Utils";
import _ from "lodash";
import { useState } from "react";
import { useMaticoDispatch, useMaticoSelector } from "./redux";

export const useMaticoSpec = (
    editPath: string
) => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const pane = _.get(spec, editPath);
  const parentPane = _.get(spec, findParentContainer(editPath));
  const parentLayout = parentPane?.layout

  return [
      pane,
      parentLayout
  ]
}