import React from 'react'
import { useRecoilValue } from 'recoil'
import { MaticoDateTimeSliderInterface } from './MaticoDateTimeSlider'
import { DateTimeSliderPane } from '@maticoapp/matico_types/spec'
import { panesAtomFamily } from "Stores/SpecAtoms"
import { useMaticoSelector } from 'Hooks/redux'
import { useAutoVariable } from 'Hooks/useAutoVariable'
import { useRequestColumnStat } from 'Hooks/useRequestColumnStat'
import { CalendarDate } from '@internationalized/date'
import { asDateTimeSliderPane } from 'Panes/utils'

export const withDateTimeSliderWrapper: (paneId: string, PaneImplementation: React.FC<MaticoDateTimeSliderInterface>) => React.ReactElement = (paneId, PaneImplementation) => {

  const pane = useRecoilValue(panesAtomFamily(paneId))
  const { column, dataset, id, min, max } = asDateTimeSliderPane(pane)

  const [range, setRange] = useAutoVariable({
    variable: {
      id: id + "_date_range",
      paneId: id,
      name: `${column}_date_range`,
      value: {
        type: "dateRange",
        value: "NoSelection"
      }
    },
    bind: true
  });

  if (!dataset?.name) { throw Error("No Dataset specified") }
  if (!column?.length) { throw Error("No Column specified") }

  const foundDataset = useMaticoSelector(
    (state) => state.datasets.datasets[dataset.name]
  );

  const datasetReady = foundDataset && foundDataset.state === "READY";

  const extentRequest = foundDataset
    ? {
      datasetName: dataset.name,
      column,
      metric: "extent",
      filters: dataset.filters,
      parameters: {}
    }
    : null;


  const extentResult = useRequestColumnStat(extentRequest);
  const extent = extentResult?.result;

  const startDate = range.value = "NoSelection" ? extent.min : range.value.min
  const endDate = range.value = "NoSelection" ? extent.max : range.value.max

  const updateDateRange = (value: { startDate: CalendarDate, endDate: CalendarDate }) => {
    setRange({
      type: "dateRange",
      value: { minDate: value.startDate, maxDate: value.endDate }
    })
  }

  return (
    <PaneImplementation startDate={startDate} endDate={endDate} minDate={extent.min} maxDate={extent.max} onDateRangeChanges={updateDateRange} />
  )

}
