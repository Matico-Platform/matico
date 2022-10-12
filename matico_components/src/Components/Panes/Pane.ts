import { PanePosition } from "@maticoapp/matico_types/spec";
import { MaticoControlsPane } from "Components/Panes/MaticoControlsPane/MaticoControlsPane";
import { MaticoContainerPane } from "Components/Panes/MaticoContainerPane/MaticoContainerPane";
import { MaticoHistogramPane } from "Components/Panes/MaticoHistogramPane/MaticoHistogramPane";
import { MaticoPieChartPane } from "Components/Panes/MaticoPieChartPane/MaticoPieChartPane";
import { MaticoScatterplotPane } from "Components/Panes/MaticoScatterplotPane/MaticoScatterplotPane";
import { MaticoTextPane } from "Components/Panes/MaticoTextPane/MaticoTextPane";
import { MaticoMapPane } from "Components/Panes/MaticoMapPane/MaticoMapPane";
import { MaticoStaticMapPane } from "./MaticoStaticMapPane/MaticoStaticMapPane";
import {MaticoDateTimeSlider} from "./MaticoDateTimeSlider/MaticoDateTimeSlider";

export interface MaticoPaneInterface {
    position: PanePosition;
    id: string;
    name: string;
    background: string;
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
    | typeof MaticoDateTimeSlider;
