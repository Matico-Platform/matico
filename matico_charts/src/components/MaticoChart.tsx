import React from "react";
import ChartSpace from "./ChartSpace";
import { ChartSpaceSpec } from "./types";
import { Provider, useStore } from "../Store/maticoChartStore";
import { useEffect } from "react";

export default function MaticoChart(props: ChartSpaceSpec) {
  return (
    <div style={{position:"relative", width:"100%", height:"100%", background: 'red'}}>
        <Provider props={props}>
            <ChartSpace />
        </Provider>
    </div>
  );
}
