import { Checkbox } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import Select from 'react-dropdown-select';
import {Column, LayerSource} from 'api'
import {useUniqueColumnValues} from 'Hooks/useUniqueColumnValues'

import {CategoricalColor} from '../types'

interface CategoryColorSelectorProps{
    // onChange : (colorSpecification: CategoricalColor)=>void,
    // colorSpecification : CategoricalColor
    columns?:Column[],
    source?: LayerSource
}

export const CategoryColorSelector: React.FC<CategoryColorSelectorProps> = ({columns,source})=>{
    const [selectedColumn, setSelectedColumn] = useState<Column|undefined>(undefined)

    useEffect(()=>{
        if(columns){
            setSelectedColumn(columns[0])
        }
        else{
            setSelectedColumn(undefined)
        }
    },[columns])


    const selectColumn = (column: Column[])=>{
        setSelectedColumn(column[0])
    }

    const columnValues = useUniqueColumnValues(source, selectedColumn?.name)

    return(
        <div>
            <label>Column</label>
            {columns &&
                <Select options={columns} valueField={'name'} labelField={'name'} values={[columns[0]]} onChange={selectColumn} />
            }
            <label>Include Nulls</label>
            <Checkbox checked={false}></Checkbox>
            {columnValues &&
                <ul>
                    {columnValues.map(cat=>(
                        <li key={cat.name}>
                            <label>{cat.name}</label>
                            <label>{cat.count}</label>
                        </li>
                    ))}
                </ul>
            }
        </div>
    )
}