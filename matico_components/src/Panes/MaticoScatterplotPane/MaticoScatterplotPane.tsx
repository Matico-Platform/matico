import React, { useMemo } from "react";
import _ from "lodash";
import { useMaticoSelector } from "Hooks/redux";
import { useRequestData } from "Hooks/useRequestData";
import { useAutoVariable } from "Hooks/useAutoVariable";
import { MaticoChart } from "@maticoapp/matico_charts";
import {
  generateColorVar,
  generateNumericVar
} from "../MaticoMapPane/LayerUtils";
import { View } from "@adobe/react-spectrum";
import {
  PaneRef,
  ScatterplotPane
} from "@maticoapp/matico_types/spec";
import { MissingParamsPlaceholder } from "../MissingParamsPlaceholder/MissingParamsPlaceholder";
import { useRecoilValue } from "recoil";
import { panesAtomFamily } from "Stores/SpecAtoms";

export interface MaticoScatterplotPaneInterface {
  paneRef: PaneRef;
}

export const MaticoScatterplotPane: React.FC<
  MaticoScatterplotPaneInterface
> = ({
  paneRef }) => {

    const pane = useRecoilValue(panesAtomFamily(paneRef.paneId))
    if (pane.type !== 'scatterplot') { throw Error("Expected this to be a scatterplot pane") }

    const { dataset, xColumn, yColumn, dotSize, dotColor, id, labels } = pane as { type: "scatterplot" } & ScatterplotPane

    let columns = [xColumn, yColumn];
    if (typeof dotSize === "object" && "variable" in dotSize) {
      columns.push(dotSize.variable);
    }
    if (typeof dotColor === "object" && "variable" in dotColor) {
      columns.push(dotColor.variable);
    }

    const paramsAreNull = dataset.name === "uknown" || columns.includes(null);
    const chartData = useRequestData({
      datasetName: dataset.name,
      filters: dataset.filters,
      columns
    });

    const [
      ,
      updateXFilter
      //@ts-ignore
    ] = useAutoVariable({
      variable: {
        name: `${xColumn}_range`,
        id: id + "x_filter",
        paneId: id,
        value: {
          type: "range",
          value: "NoSelection"
        }
      },
      bind: true
    });

    const [
      ,
      updateYFilter
      //@ts-ignore
    ] = useAutoVariable({
      variable: {
        name: `${yColumn}_range`,
        id: id + "y_filter",
        paneId: id,
        value: {
          type: "range",
          value: "NoSelection"
        }
      },
      bind: true
    });

    const Chart = useMemo(() => {
      if (paramsAreNull) return null;
      const data = chartData?.state === "Done" ? chartData.result : [];

      if (!data || !data?.length) return null;

      const dotSizeFunc = generateNumericVar(dotSize);
      const dotColorFunc = generateColorVar(dotColor);

      const xVals = data.map((d: Record<string, unknown>) => d[xColumn]);
      const yVals = data.map((d: Record<string, unknown>) => d[yColumn]);

      const xExtent = [Math.min(...xVals), Math.max(...xVals)];

      const yExtent = [Math.min(...yVals), Math.max(...yVals)];

      return (
        <MaticoChart
          xExtent={xExtent}
          yExtent={yExtent}
          xLabel={labels?.xLabel ?? xColumn}
          yLabel={labels?.yLabel ?? yColumn}
          xCol={xColumn}
          yCol={yColumn}
          title={labels?.title ?? `${xColumn} vs ${yColumn}`}
          subtitle={labels?.subTitle}
          attribution={labels?.attribution}
          data={data}
          xAxis={{
            scaleType: "linear",
            position: "bottom"
          }}
          yAxis={{
            scaleType: "linear",
            position: "left"
          }}
          grid={{ rows: true, columns: false }}
          layers={[
            {
              type: "scatter",
              color: dotColorFunc,
              scale: dotSizeFunc
            }
          ]}
          useBrush={{
            horizontal: true,
            vertical: true
          }}
          //@ts-ignore
          onBrush={({ x0, x1, y0, y1 }) => {
            updateXFilter(
              x0 === x1
                ? {
                  type: "range",
                  value: "NoSelection"
                }
                : {
                  type: "range",
                  value: {
                    min: x0,
                    max: x1
                  }
                }
            );
            updateYFilter(
              y0 === y1
                ? {
                  type: "range",
                  value: "NoSelection"
                }
                : {
                  type: "range",
                  value: {
                    min: y0,
                    max: y1
                  }
                }
            );
          }}
        />
      );
    }, [chartData, dotColor, dotSize]);

    return (
      <View position="relative" width="100%" height="100%">
        {!!paramsAreNull && (
          <MissingParamsPlaceholder paneName="Scatterplot" />
        )}
        {Chart}
      </View>
    );
  };
