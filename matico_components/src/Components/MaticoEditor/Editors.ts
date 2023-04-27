import { MapPaneEditor } from "./Panes/MapPaneEditor";
import { ScatterplotPaneEditor } from "./Panes/ScatterPlotPaneEditor";
import { HistogramPaneEditor } from "./Panes/HistogramPaneEditor";
import { PieChartPaneEditor } from "./Panes/PieChartPaneEditor";
import { ContainerPaneEditor } from "./Panes/ContainerPaneEditor";
import { LayerEditor } from "./Panes/LayerEditor";
import { ControlsPaneEditor } from "./Panes/ControlsEditor";
import { StaticMapPaneEditor } from "./Panes/StaticMapEditor";
import { DateTimeSliderEditor } from "./Panes/DateTimeSliderEditor";
// new file schema
import { MaticoTextPaneComponents } from "Components/Panes/MaticoTextPane";
import { LineChartPaneEditor } from "./Panes/LineChartPaneEditor";
import { MaticoSwitchesPaneComponents } from "Components/Panes/MaticoSwitchesPane";
import { MaticoCategorySelectorPaneComponents } from "Components/Panes/MaticoCategorySelectorPane";

export const Editors = {
    container: ContainerPaneEditor,
    scatterplot: ScatterplotPaneEditor,
    lineChart: LineChartPaneEditor,
    map: MapPaneEditor,
    text: MaticoTextPaneComponents.sidebarPane,
    histogram: HistogramPaneEditor,
    categorySelector: MaticoCategorySelectorPaneComponents.sidebarPane,
    pieChart: PieChartPaneEditor,
    layer: LayerEditor,
    controls: ControlsPaneEditor,
    staticMap: StaticMapPaneEditor,
    dateTimeSlider: DateTimeSliderEditor,
    switches: MaticoSwitchesPaneComponents.sidebarPane
};
