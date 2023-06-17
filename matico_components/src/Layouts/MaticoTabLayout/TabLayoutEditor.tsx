import React from 'react'
import { TabBarPosition, TabLayout } from "@maticoapp/matico_types/spec";
import { Flex, Radio, RadioGroup } from '@adobe/react-spectrum';

export interface TabLayoutEditorProps {
  layout: TabLayout;
  onChange: (update: Partial<TabLayout>) => void;
}

export const TabLayoutEditor: React.FC<TabLayoutEditorProps> = ({
  layout,
  onChange
}) => {
  return (
    <Flex direction="column" width="100%">
      <RadioGroup
        label="Tab bar location"
        value={layout.tabBarPosition}
        onChange={(val) =>
          onChange({ tabBarPosition: val as TabBarPosition })
        }
      >
        <Flex direction="row" wrap={"wrap"}>
          <Radio value="horizontal">Horizontal</Radio>
          <Radio value="vertical">Vertical</Radio>
        </Flex>
      </RadioGroup>
    </Flex>
  );
};
