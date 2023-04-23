import { PanePosition } from "@maticoapp/matico_types/spec";
import MaticoControlsPane from "./MaticoControlsPane";
import MaticoContainerPane from "./MaticoContainerPane";
import MaticoHistogramPane from "./MaticoHistogramPane";
import MaticoPieChartPane from "./MaticoPieChartPane";
import MaticoScatterplotPane from "./MaticoScatterplotPane";
import MaticoTextPane from "./MaticoTextPane";
import MaticoMapPane from "./MaticoMapPane";
import MaticoStaticMapPane from "./MaticoStaticMapPane";
import MaticoDateTimeSlider from "./MaticoDateTimeSlider";
import MaticoCategorySelector from "./MaticoCategorySelectorPane";
import MaticoLineChartPane from "./MaticoLineChartPane";
import { PaneParts } from "./PaneParts";

export interface MaticoPaneInterface {
    position: PanePosition;
    id: string;
    name: string;
    background: string;
}

export const PaneDefs: Record<string, PaneParts> = {
    "map": MaticoMapPane,
    "histogram": MaticoHistogramPane,
    "pieChart": MaticoPieChartPane,
    "controls": MaticoControlsPane,
    "container": MaticoContainerPane,
    "lineChart": MaticoLineChartPane,
    "scatterplot": MaticoScatterplotPane,
    "staticMap": MaticoStaticMapPane,
    "dateTimeSlider": MaticoDateTimeSlider,
    "categorySelector": MaticoCategorySelector,
    "text": MaticoTextPane,
}

export type Pane =
    | typeof MaticoControlsPane
    | typeof MaticoHistogramPane
    | typeof MaticoMapPane
    | typeof MaticoPieChartPane
    | typeof MaticoScatterplotPane
    | typeof MaticoContainerPane
    | typeof MaticoTextPane
    | typeof MaticoStaticMapPane
    | typeof MaticoCategorySelector
    | typeof MaticoDateTimeSlider;
