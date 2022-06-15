import { Flex, Heading, Text, View } from "@adobe/react-spectrum";
import React from "react";
import { generateColor, getColorScale } from "../MaticoMapPane/LayerUtils";
import { scaleLinear, scaleOrdinal, scaleThreshold, scaleQuantile } from '@visx/scale';
import {
  Legend,
  LegendLinear,
  LegendQuantile,
  LegendOrdinal,
  LegendSize,
  LegendThreshold,
  LegendItem,
  LegendLabel,
} from '@visx/legend';
import chroma from "chroma-js";
import { colors } from "Utils/colors";
import _ from "lodash";
import prettyNum, {PRECISION_SETTING} from 'pretty-num';

// interface MaicoMapPaneInterface extends MaticoPaneInterface {
//     view: View;
//     //TODO WE should properly type this from the @maticoapp/matico_spec library. Need to figure out the Typescript integration better or witx
//     base_map?: any;
//     layers?: Array<any>;
//     editPath?: string;
// }



export function nicelyFormatNumber(x: number | string){
  console.log(x)
  const val = +x;
  if (!x || isNaN(val)) return x;
  if (val < 0.0001) return val.toExponential();
  if (val < 0.01) return val.toFixed(4);
  if (val < 1) return val.toFixed(3);
  if (val < 10) return val.toFixed(2);
  if (val < 100) return val.toFixed(1);
  if (val < 1_000) return val.toFixed(0);
  if (val < 10_000) return `${(val/1_000).toFixed(1)}K`;
  if (val < 1_000_000) return `${(val/1_000).toFixed(0)}K`;
  if (val < 1_000_000_000) return `${(val/1_000_000).toFixed(1)}M`;
  if (val < 1_000_000_000_000) return `${(val/1_000_000).toFixed(1)}B`;
  return val.toExponential();
}

const Legend: React.FC<{layer: any}> = ({
  layer={}
}) => {
  const {
    name,
    colorScale
  } = layer

  const {
    range: colorScaleName,
    domain
  } = colorScale;

  const range = _.get(colors, colorScaleName)
  // const range = chroma.scale(colorScale).domain(domain?.length || 0);
  const scale = scaleThreshold<number>({
    domain,
    range,
  });

  return <div>
    <div>
      {name}
    </div>
    <LegendThreshold scale={scale} labelFormat={nicelyFormatNumber}>
      {(labels) => {
        return labels.reverse().map((label, i) => (
          <LegendItem
            key={`legend-quantile-${i}`}
            margin="1px 0"
            // onClick={() => {
            //   if (events) alert(`clicked: ${JSON.stringify(label)}`);
            // }}
          >
            <svg width={20} height={20}>
              <circle fill={`rgb(${label.value.join(',')})`} r={8} cx={10} cy={10} />
            </svg>
            <LegendLabel align="left" margin="2px 0 0 10px">
              {label.text}
            </LegendLabel>
          </LegendItem>
        ))}
      }
    </LegendThreshold>
  </div> 
}

export const MaticoLegendPane: React.FC<{layers: any[]}> = ({ layers = [] }) => {
  return layers && layers.length ? (
    <View
      position="absolute"
      right=".75em"
      bottom="1.5em"
      backgroundColor="default"
      padding="size-100"
    >
      <Flex direction="row">
        {layers.map((layer) =>
          <Legend layer={layer} />
        )}
      </Flex>
    </View>
  ) : null;
};
