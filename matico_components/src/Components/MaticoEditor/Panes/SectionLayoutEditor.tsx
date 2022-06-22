import React from 'react';
import {
    Well,
    Heading,
    TextField,
    Picker,
    Item
} from '@adobe/react-spectrum';
import { availableLayouts } from 'Utils/layoutEngine';
import {Layout} from '@maticoapp/matico_types/spec';

interface SectionLayoutEditorProps {
    name: string;
    layout: Layout;
    updateSection: ({ change }: { [key: string]: any }) => void;
}

export const SectionLayoutEditor: React.FC<SectionLayoutEditorProps> = ({
    name,
    layout,    
    updateSection
}) => {
    return <Well>
        <Heading>Details</Heading>
        <TextField
            label="Name"
            value={name}
            onChange={(name) => updateSection({ name })}
        />
        <Picker
            selectedKey={layout}
            label="Layout"
            onSelectionChange={(layout) => updateSection({ layout })}
        >
            {availableLayouts.map(({ name, label }) => <Item key={name}>{label}</Item>)}
        </Picker>
    </Well>
}
