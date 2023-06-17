import { CategorySelectorPane, DateTimeSliderPane, ContainerPane, HistogramPane, ScatterplotPane, TextPane, PieChartPane } from "@maticoapp/matico_types/spec";
import { Pane } from "Stores/SpecAtoms";

export function asCategorySelectorPane(pane: Pane) {
  if (pane.type !== 'categorySelector') { throw Error(`Expected this pane to be a categorySelector pane ${pane.type}`) }
  const { type, ...categorySelector } = pane as { type: "categorySelector" } & CategorySelectorPane
  return categorySelector
}

export function asDateTimeSliderPane(pane: Pane) {
  if (pane.type !== 'dateTimeSlider') { throw Error(`Expected this pane to be a dateTimeSlider pane ${pane.type}`) }
  const { type, ...dateTimeSlider } = pane as { type: "dateTimeSlider" } & DateTimeSliderPane
  return dateTimeSlider
}
export function asContainerPane(pane: Pane) {
  if (pane.type !== 'container') { throw Error(`Expected this pane to be a container pane ${pane.type}`) }
  const { type, ...containerPane } = pane as { type: "container" } & ContainerPane
  return containerPane
}

export function asHistogramPane(pane: Pane) {
  if (pane.type !== 'histogram') { throw Error(`Expected this pane to be a histogram pane ${pane.type}`) }
  const { type, ...histogramPane } = pane as { type: "histogram" } & HistogramPane
  return histogramPane
}

export function asScatterPlotPane(pane: Pane) {
  if (pane.type !== 'scatterplot') { throw Error(`Expected this pane to be a scatterplot pane ${pane.type}`) }
  const { type, ...scatterPlot } = pane as { type: "scatterplot" } & ScatterplotPane
  return scatterPlot
}

export function asTextPane(pane: Pane) {
  if (pane.type !== 'text') { throw Error(`Expected this pane to be a text pane ${pane.type}`) }
  const { type, ...textPane } = pane as { type: "text" } & TextPane
  return textPane
}

export function asPieChartPane(pane: Pane) {
  if (pane.type !== 'pieChart') { throw Error(`Expected this pane to be a pie chart pane ${pane.type}`) }
  const { type, ...pieChart } = pane as { type: "pieChart" } & PieChartPane
  return pieChart
}
