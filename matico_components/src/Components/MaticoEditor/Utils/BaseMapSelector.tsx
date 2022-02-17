import { Picker, Text, Item } from "@adobe/react-spectrum";
import React from "react";

const BaseMaps = [
  "CartoDBPositron",
  "CartoDBVoyager",
  "CartoDBDarkMatter",
  "Light",
  "Dark",
  "Satelite",
  "Terrain",
  "Streets",
];

interface BaseMapSelectorProps {
  baseMap: string;
  onChange: (baseMap: string) => void;
}

export const BaseMapSelector: React.FC<BaseMapSelectorProps> = ({
  baseMap,
  onChange,
}) => {
  return (
    <Picker
      label='Basemap'
      width="100%"
      items={BaseMaps.map((bm) => ({ key: bm }))}
      selectedKey={baseMap}
      onSelectionChange={(newBasemap) => onChange(newBasemap as string)}
    >
      {(basemapOption) => (
        <Item key={basemapOption.key}>{basemapOption.key}</Item>
      )}
    </Picker>
  );
};
