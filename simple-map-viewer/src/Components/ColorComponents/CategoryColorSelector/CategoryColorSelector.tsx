import { Checkbox } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import Select from 'react-dropdown-select';
import { Column, LayerSource, CategoryColorSpecification } from 'types';
import { useUniqueColumnValues } from 'Hooks/useUniqueColumnValues';
import { ColorPaletteSelector } from 'Components/ColorComponents/ColorPaletteSelector/ColorPaletteSelector';
import { getColors } from 'Components/ColorComponents/ColorUtils';
import chroma from 'chroma-js';

interface CategoryColorSelectorProps {
    onUpdate: (spec: CategoryColorSpecification) => void;
    spec: CategoryColorSpecification;
    columns?: Column[];
    source?: LayerSource;
}

export const CategoryColorSelector: React.FC<CategoryColorSelectorProps> = ({
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

    useEffect(() => {
        if (columns) {
            setSelectedColumn(columns[0]);
        } else {
            setSelectedColumn(undefined);
        }
    }, [columns]);

    const selectColumn = (column: Column[]) => {
        setSelectedColumn(column[0]);
    };

    const columnValues = useUniqueColumnValues(
        source,
        selectedColumn?.name,
    );

    useEffect(() => {
        if (columnValues && selectedColumn) {
            onUpdate({
                column: selectedColumn.name,
                categories: columnValues
                    .slice(0, 8)
                    .map((cat) => cat.name),
                colors: getColors(colorPalette, reversed)
                    .slice(0, 8)
                    .map((c: string) => [
                        ...chroma(c).rgba().slice(0, 3),
                        255,
                    ]),
            });
        }
    }, [columnValues, reversed, colorPalette, selectedColumn]);
    
    const colors = getColors(colorPalette, reversed);

    return (
        <div>
            <label>Column</label>
            {columns && (
                <Select
                    options={columns}
                    valueField={'name'}
                    labelField={'name'}
                    values={[columns[0]]}
                    onChange={selectColumn}
                />
            )}

            <ColorPaletteSelector
                selectedPalette={colorPalette}
                onPaletteSelected={(palette) =>
                    setColorPalette(palette)
                }
                reversed={reversed}
                onOrderChange={setReversed}
            />

            <label>Include Nulls</label>

            <Checkbox checked={false}></Checkbox>
            {columnValues && (
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Count</th>
                            <th>Color</th>
                        </tr>
                    </thead>
                    <tbody>
                        {columnValues
                            .slice(0, 8)
                            .map((cat, index) => (
                                <tr key={cat.name}>
                                    <td>{cat.name}</td>
                                    <td>{cat.count}</td>
                                    <td
                                        style={{
                                            backgroundColor:
                                                colors[index],
                                        }}
                                    ></td>
                                </tr>
                            ))}
                        <tr>
                            <td>Others</td>
                            <td>
                                {columnValues
                                    .slice(8, -1)
                                    .reduce(
                                        (total, val) =>
                                            total + val.count,
                                        0,
                                    )}
                            </td>
                            <td
                                style={{
                                    backgroundColor:
                                        colors[colors.length - 1],
                                }}
                            ></td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};
