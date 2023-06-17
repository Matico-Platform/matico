import { Picker, Item, View } from '@adobe/react-spectrum';
import { Layout } from '@maticoapp/matico_types/spec';
import React from 'react'
import { layoutForContainer } from 'Stores/SpecAtoms'
import { useRecoilState } from 'recoil';
import { Layouts } from 'Layouts'

interface LayoutEditorProps {
  containerId: string
  containerType: 'page' | 'pane'
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({
  containerId,
  containerType
}) => {

  const [layout, updateLayout] = useRecoilState(layoutForContainer({ containerId, containerType }))
  const Editor = Layouts[layout.type].Editor

  return (
    <View width="100%">
      <Picker
        width="100%"
        selectedKey={layout.type}
        label="Layout"
        onSelectionChange={(layout) =>
          updateLayout({
            type: layout,
            ...Layouts[layout].default
          })
        }
      >
        {Object.values(Layouts).map(({ type, label }) => (
          <Item key={type}>{label}</Item>
        ))}
      </Picker>
      <Editor
        layout={layout}
        onChange={(update: Partial<Layout>) =>
          updateLayout({ ...layout, ...update })
        }
      />
    </View>
  );
};
