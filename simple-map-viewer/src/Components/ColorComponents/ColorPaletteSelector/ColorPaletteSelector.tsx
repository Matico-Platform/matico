import React, { useState } from 'react';
import { Styles } from './ColorPaletteSelectorStyles';
import { ColorPalette } from 'Components/ColorComponents/ColorPalette/ColorPalette';
import { getColors } from 'Components/ColorComponents/ColorUtils';
import Select from 'react-select';
import colorbrewer from 'colorbrewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faArrowRight,
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

interface ColorPaletteSelector {
    selectedPalette: string;
    onPaletteSelected: (palette: string) => void;
    reversed: boolean;
    onOrderChange: (isReveresed: boolean) => void;
}
export const ColorPaletteSelector: React.FC<ColorPaletteSelector> = ({
    selectedPalette,
    reversed,
    onOrderChange,
    onPaletteSelected,
}) => {
    const palette = {
        value: selectedPalette,
        label: selectedPalette,
        customAbbreviation: selectedPalette,
    };

    const formatOptionLabel = ({
        value,
        label,
        customAbbreviation,
    }: {
        value: string;
        label: string;
        customAbbreviation: string;
    }) => (
        <ColorPalette
            name={value}
            colors={getColors(value, reversed)}
        />
    );

    const options = Object.keys(colorbrewer).map((col: string) => ({
        value: col,
        label: col,
        customAbbreviation: col,
    }));

    //@ts-ignore
    const SingleValue = ({ children, ...props }) => (
        <ColorPalette
            {...props}
            colors={getColors(props.data.value, reversed)}
        />
    );
    const reversePalette = () => {
        onOrderChange(!reversed);
    };

    return (
        <Styles.ColorPaletteSelector>
            <Select
                options={options}
                values={palette}
                onChange={(newPalette) =>
                    onPaletteSelected(newPalette!.value)
                }
                formatOptionLabel={formatOptionLabel}
                components={{
                    SingleValue,
                }}
                styles={{
                    container: (provided, state) => ({
                        ...provided,
                        flex: 1,
                        paddingRight: '10px',
                    }),
                    singleValue: (provided, state) => ({
                        ...provided,
                        display: 'flex',
                        alignItems: 'center',
                    }),
                }}
            />
            <FontAwesomeIcon
                onClick={() => reversePalette()}
                icon={reversed ? faArrowLeft : faArrowRight}
            />
        </Styles.ColorPaletteSelector>
    );
};
