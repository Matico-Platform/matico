import React, { useState, useEffect } from 'react';
import { Styles } from './NumericalSelectorStyles';
import { Categorizer } from 'Components/NumericalComponents/Categorizer/Categorizer';
import Select from 'react-select';

import {
    Column,
    LayerSource,
    NumericalCategorizationMethod,
    ValueSpecification,
} from 'api';

interface NumericalSelectorProps {
    columns: Column[];
    source: LayerSource;
    name: string;
    valueSpecification?: ValueSpecification | null;
    onUpdate: (value: ValueSpecification) => void;
}

export const NumericalSelector: React.FC<NumericalSelectorProps> = ({
    columns,
    source,
    name,
    valueSpecification,
    onUpdate,
}) => {
    const [
        selectedColumn,
        setSelectedColumn,
    ] = useState<Column | null>(null);

    const [
        method,
        setMethod,
    ] = useState<NumericalCategorizationMethod>(
        NumericalCategorizationMethod.EqualInterval,
    );

    useEffect(() => {
        if (columns) {
            setSelectedColumn(columns[0]);
        } else {
            setSelectedColumn(null);
        }
    }, [columns]);

    const selectColumn = (column: Column | null) => {
        setSelectedColumn(column);
    };
    console.log('columns are ', columns, selectedColumn);
    return (
        <div>
            <label>{name}</label>
            <label>Column</label>
            {columns && (
                <Select
                    options={columns}
                    getOptionValue={(option) => option.name}
                    getOptionLabel={(option) => option.name}
                    values={[selectedColumn]}
                    onChange={(col) => selectColumn(col)}
                    styles={{
                        option: (provided, state) => ({
                            ...provided,
                            color: 'black',
                        }),
                        control: (provided) => ({
                            ...provided,
                            color: 'black',
                        }),
                        singleValue: (provided) => ({
                            ...provided,
                            color: 'black',
                        }),
                    }}
                />
            )}
            {selectedColumn && (
                <Categorizer
                    column={selectedColumn}
                    source={source}
                    method={method}
                    onUpdate={setMethod}
                />
            )}
        </div>
    );
};
