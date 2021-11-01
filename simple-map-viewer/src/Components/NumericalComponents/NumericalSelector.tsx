import React, { useState, useEffect } from 'react';
import { Styles } from './NumericalSelectorStyles';
import { Categorizer } from 'Components/NumericalComponents/Categorizer/Categorizer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

import {
    Column,
    LayerSource,
    NumericalCategorizationMethod,
    ValueSpecification,
} from 'types';

export enum ValueMappingTypes {
    Value = 'value',
    Simple = 'manual',
}

interface NumericalSelectorProps {
    columns: Column[];
    source: LayerSource;
    name: string;
    valueSpecification?: ValueSpecification | null | undefined;
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

    const [activeMode, setActiveMode] = useState<ValueMappingTypes>(
        ValueMappingTypes.Simple,
    );

    return (
        <section>
            <Styles.Header>
                <label>{name}</label>
                <Styles.Modes>
                    <p
                        className="icon"
                        onClick={() =>
                            setActiveMode(ValueMappingTypes.Simple)
                        }
                        style={{
                            cursor: 'pointer',
                            color:
                                activeMode == ValueMappingTypes.Simple
                                    ? 'white'
                                    : 'grey',
                        }}
                    >
                        3
                    </p>
                    <FontAwesomeIcon
                        className="icon"
                        style={{
                            cursor: 'pointer',
                            color:
                                activeMode == ValueMappingTypes.Value
                                    ? 'white'
                                    : 'grey',
                        }}
                        icon={faCalculator}
                        onClick={() =>
                            setActiveMode(ValueMappingTypes.Value)
                        }
                    />
                </Styles.Modes>
            </Styles.Header>
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
            {selectedColumn && valueSpecification && (
                <>
                    {ValueMappingTypes.Simple && (
                        <div>
                            <input
                                value={
                                    valueSpecification.simpleValue!
                                }
                                type="number"
                                onChange={(e) =>
                                    onUpdate({
                                        simpleValue: parseFloat(
                                            e.target.value,
                                        ),
                                    })
                                }
                            />
                        </div>
                    )}
                    <Categorizer
                        column={selectedColumn}
                        source={source}
                        method={method}
                        onUpdate={setMethod}
                    />
                </>
            )}
        </section>
    );
};
