import React from "react";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import ChartSpace from "./ChartSpace";
import { ChartSpaceSpec } from "./types";

export default function MaticoChart(props: ChartSpaceSpec) {
  const { data, dimensions } = props;

  return (
    <ParentSize>
      {({ width, height }) => {
        console.log("Parent Width and height ", width, height);
        return (
          <ChartSpace
            {...props}
            data={data}
            dimensions={
              dimensions
                ? {
                    width: dimensions.width || width,
                    height: dimensions.height || height,
                  }
                : {
                    width,
                    height,
                  }
            }
          />
        );
      }}
    </ParentSize>
  );
}
