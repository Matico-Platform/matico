import { Styles } from './ColorPaletteStyles';
import React from 'react';

interface ColorPalette {
    name?: string;
    colors: string[];
    reversed?: boolean;
}

export const ColorPalette: React.FC<ColorPalette> = ({
    name,
    colors,
}) => {
    return (
        <Styles.ColorPalette>
            {name && <h3>{name}</h3>}
            <Styles.Colors>
                {colors.map((col: string) => (
                    <Styles.Color color={col} key={col} />
                ))}
            </Styles.Colors>
        </Styles.ColorPalette>
    );
};
