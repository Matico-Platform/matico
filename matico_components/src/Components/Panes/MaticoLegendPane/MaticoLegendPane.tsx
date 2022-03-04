import { Flex, Heading, Text, View } from "@adobe/react-spectrum";
import React from "react";
import { generateColor, getColorScale } from "../MaticoMapPane/LayerUtils";

// interface MaicoMapPaneInterface extends MaticoPaneInterface {
//     view: View;
//     //TODO WE should properly type this from the @maticoapp/matico_spec library. Need to figure out the Typescript integration better or witx
//     base_map?: any;
//     layers?: Array<any>;
//     editPath?: string;
// }



export const MaticoLegendPane = ({ layers = [] }) => {

  console.log("Layers for legend ", layers)
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
          layer?.colorScale?.domain && layer?.colorScale?.range ? (
            <View key={layer.name}>
              <Text>{layer.name}</Text>
              <Flex direction="row">
                <Flex direction="column-reverse">
                  {"string" == typeof layer.colorScale.range
                    ? getColorScale(layer.colorScale.range)[0]
                      ? getColorScale(layer.colorScale.range)[0].map(
                          (color) => (
                            <View
                              width="size-150"
                              flexGrow={1}
                              key={color}
                              UNSAFE_style={{ backgroundColor: color }}
                            />
                          )
                        )
                      : null
                    : layer?.colorScale?.range
                    ? layer.colorScale.range.map((d) => {
                       console.log("GETTING MAP ",d)
                        return (
                          <View
                            key={`rgb(${generateColor(d, false)
                              .slice(0, 3)
                              .join(",")})`}
                            UNSAFE_style={{
                              backgroundColor: `rgb(${generateColor(d, false)
                                .slice(0, 3)
                                .join(",")})`,
                            }}
                          />
                        );
                      })
                    : null}
                </Flex>
                <Flex
                  direction="column-reverse"
                  justifyContent="space-evenly"
                  alignItems="start"
                  marginY={`${100 / layer.colorScale.range.length / 2}%`}
                  marginStart="size-50"
                >
                  {!!layer?.colorScale?.domain &&
                    layer.colorScale.domain
                      .map((d) => (
                        "string" === typeof(d) ? 
                        <Text key={d}>
                          {d}
                        </Text>
                        :
                        <Text key={Math.round(d).toLocaleString("en")}>
                          {(Math.round(d * 10) / 10).toLocaleString("en")}
                        </Text>
                      ))}
                </Flex>
              </Flex>
            </View>
          ) : null
        )}
      </Flex>
    </View>
  ) : null;
};
