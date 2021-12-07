import { Text, Box, Select } from "grommet";
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
    <Box fill direction={"row"} justify={'between'} align="center">
      <Text>Base Map</Text>
      <Select
        options={BaseMaps}
        value={baseMap}
        onChange={({ value }) => onChange(value)}
      />
    </Box>
  );
};
