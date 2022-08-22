import { Picker, Item, Section, View, Text, Flex } from "@adobe/react-spectrum";
import React from "react";
import { colors } from "../../../Utils/colors";

interface ColorPaletteSelectorInterface {
    selectedPalette: { name: string; colors: any };
    onSelectPalette: (palette: { name: string; colors: any }) => void;
}

export type ColorGroup = Array<{ name: string; colors: Array<string> }>;


function MapColorsToGroup(tag:string, propertyType:string){
  return Object.entries(colors)
  .filter(([name,values])=> values.tags?.includes(tag) 
           || values.properties?.type=== propertyType 
         )
      .map( ([name,values])=>({name,colors:values[7]}))
}

export const ColorPaletteSelector: React.FC<ColorPaletteSelectorInterface> = ({
    selectedPalette,
    onSelectPalette
}) => {


    const colorOptions: Array<{ groupName: string; colors: ColorGroup }> =
      [
      {groupName: "sequential", colors :  MapColorsToGroup("quantitative", "seq")},
      {groupName: "diverging", colors :  MapColorsToGroup("diverging", "div")},
      {groupName: "qualitative", colors :  MapColorsToGroup("qualitative", "qual")},
    ]

    const updatePalette = (paletteName: string) => {
        //@ts-ignore
        onSelectPalette({ name: paletteName, colors: colors[paletteName] });
    };

    return (
        <Picker
            width="100%"
            label="Palette"
            placeholder="Custom"
            selectedKey={selectedPalette?.name}
            items={colorOptions}
            onSelectionChange={updatePalette}
        >
            {(section) => (
                <Section
                    key={section.groupName}
                    items={section.colors}
                    title={section.groupName}
                >
                    {(item) => (
                      <Item key={item.name} textValue={item.name}>
                          <Text >
                            <Text>{item.name}</Text>
                            <Flex direction="row" width="100%" height="100%">
                                {item.colors.map((color) => (
                                    <View
                                        key={color}
                                        UNSAFE_style={{
                                            width: "10px",
                                            height: "10px",
                                            backgroundColor: typeof(color) ==='string' ? color :  `rgba(${color[0]},${color[1]},${color[2]})`
                                        }}
                                    />
                                ))}
                            </Flex>
                            </Text>
                        </Item>
                    )}
                </Section>
            )}
        </Picker>
    );
};
