import { Picker, Text, Item } from "@adobe/react-spectrum";
import {BaseMap} from "@maticoapp/matico_types/spec";
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
  baseMap: BaseMap;
  onChange: (baseMap: BaseMap) => void;
}

export const BaseMapSelector: React.FC<BaseMapSelectorProps> = ({
  baseMap,
  onChange,
}) => {
  if(baseMap.type==='named'){
    return (
      <Picker
        label='Basemap'
        width="100%"
        items={BaseMaps.map((bm) => ({ key: bm }))}
        selectedKey={baseMap.name}
        onSelectionChange={(newBasemap) => onChange({type:"named", name: newBasemap as string, affiliation:""})}
      >
        {(basemapOption) => (
          <Item key={basemapOption.key}>{basemapOption.key}</Item>
        )}
      </Picker>
    );
  }
  else{
    return(
      <h2>Basemap type not implemented</h2>
    )
  }
};
