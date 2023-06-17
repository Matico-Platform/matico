import { CategorySelectorPane } from '@maticoapp/matico_types/spec'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { panesAtomFamily } from 'Stores/SpecAtoms'
import { MaticoCateogrySelectorInterface } from './MaticoCategorySelectorPane'
import { useMaticoSelector } from 'Hooks/redux'
import { useRequestColumnStat } from 'Hooks/useRequestColumnStat'
import { LoadingSpinner } from 'Components/LoadingSpinner/LoadingSpinner'
import { asCategorySelectorPane } from '../utils'
import { variableAtomFamily } from 'Stores/StateAtoms'

export const withLinkedCategorySelector: (paneId: string, PaneImplementation: React.FC<MaticoCateogrySelectorInterface>) => React.ReactElement = (paneId, PaneImplementation) => {
  const pane = useRecoilValue(panesAtomFamily(paneId))
  const { column, dataset, name } = asCategorySelectorPane(pane)
  const [selectionVar, setSelectionVar] = useRecoilState(variableAtomFamily(`${paneId}_category_selection`))

  const foundDataset = useMaticoSelector(
    (state) => state.datasets.datasets[dataset.name]
  );

  const datasetReady = foundDataset && foundDataset.state === "READY";
  const uniqueRequest = {
    datasetName: dataset.name,
    column: column,
    metric: "categoryCounts"
  };

  const uniqueValueRequest = useRequestColumnStat(uniqueRequest);
  const categories = uniqueValueRequest?.result

  if (!datasetReady || !categories) return <LoadingSpinner />

  const updateSelection = (selection: { oneOf: Array<string>, notOneOf: Array<string> }) => {
    setSelectionVar({ type: "category", ...selectionVar, value: selection })
  }

  return (
    <PaneImplementation categories={categories} onSelectionChanged={updateSelection} selection={selectionVar.value} name={name} />
  )

}
