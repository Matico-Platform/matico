import { Picker, Item, Section, View, Text, Flex } from "@adobe/react-spectrum";
import React from "react";
import { colors } from "../../../Utils/colors";

interface ColorPaletteSelectorInterface {
  selectedPalette: {name:string, colors:any};
  onSelectPalette: (palette: {name:string, colors:any}) => void;
}

export const ColorPaletteSelector: React.FC<ColorPaletteSelectorInterface> = ({
  selectedPalette,
  onSelectPalette,
}) => {
  const colorOptions = Object.entries(colors.schemeGroups).map((group) => {
    const colorGroup = group[1].map((colName: string) => ({
      name: colName,
      //@ts-ignore
      colors: colors[colName][7],
    }));
    return { groupName: group[0], colors: colorGroup };
  });

  const updatePalette = (paletteName:string)=>{
    console.log('PALETTE NAME', paletteName)
    //@ts-ignore
    onSelectPalette({name: paletteName, colors: colors[paletteName]})
  }


  return (
    <Picker width="100%" label="Palette" placeholder="Custom" selectedKey={selectedPalette?.name} items={colorOptions} onSelectionChange={updatePalette}>
      {(section) => (
        <Section
          key={section.groupName}
          items={section.colors}
          title={section.groupName}
        >
          {(item) => (
            <Item key={item.name}>
              <Text>{item.name}</Text>
              <Flex direction="row">
                {item.colors.map((color) => (
                  <View
                    key={color}
                    UNSAFE_style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: `rgba(${color[0]},${color[1]},${color[2]})`,
                    }}
                    />
                ))}
              </Flex>
            </Item>
          )}
        </Section>
      )}
    </Picker>
  );
};
