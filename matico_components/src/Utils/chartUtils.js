import * as vega from "vega";

export function updateFilterExtent({ view, xFilter, yFilter, dataset = "" }) {
    const cs = vega
      .changeset()
      .remove(() => true)
      .insert({
        xmin: xFilter.min,
        xmax: xFilter.max,
        ymax: yFilter.max,
        ymin: yFilter.min,
      });
    // @ts-ignore
    view.change(dataset, cs).runAsync();
  }
  
export function updateActiveDataset({ view, chartData, filter, dataset }) {
    const cs = vega
      .changeset()
      .remove(() => true)
      .insert(chartData.filter(filter));
    // @ts-ignore
    view.change(dataset, cs).runAsync();
}