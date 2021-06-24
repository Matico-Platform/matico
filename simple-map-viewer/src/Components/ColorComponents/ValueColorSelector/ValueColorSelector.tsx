import React, { useState, useEffect } from 'react';
import { Column, LayerSource, ValueColorSpecification } from 'types';

interface ValueColorSelectorProps {
    onUpdate: (spec: ValueColorSpecification) => void;
    spec: ValueColorSpecification;
    columns?: Column[];
    source?: LayerSource;
}

export const ValueColorSelector: React.FC<ValueColorSelectorProps> = ({
    columns,
    source,
    spec,
    onUpdate,
}) => {
    const [colorPalette, setColorPalette] = useState<string>('BuPu');
    const [reversed, setReversed] = useState<boolean>(false);
    const [selectedColumn, setSelectedColumn] = useState<
        Column | undefined
    >(undefined);

    return <div></div>;
};
