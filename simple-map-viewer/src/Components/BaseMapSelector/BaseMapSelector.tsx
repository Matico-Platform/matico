import React from 'react';
import { Styles } from './BaseMapSelectorStyles';
import Select from 'react-dropdown-select';
import { BaseMap } from 'types'

interface BaseMapSelectorProps {
    baseMap: BaseMap;
    onChange: (baseMap: BaseMap) => void;
}

type BaseMapKey = keyof typeof BaseMap;

export const BaseMapSelector: React.FC<BaseMapSelectorProps> = ({
    baseMap,
    onChange,
}) => {
    const updateBaseMap = (
        value: { key: string; label: BaseMap }[],
    ) => {
        const newBaseMap: BaseMap =
            BaseMap[value[0].key as BaseMapKey];
        onChange(newBaseMap);
    };

    console.log('Base map is ', BaseMap, Object.values(BaseMap));
    const baseMapOptions = Object.entries(
        BaseMap,
    ).map(([key, label]) => ({ key, label }));
    const values = [{ key: baseMap, label: BaseMap[baseMap] }];
    return (
        <Styles.BaseMapSelector>
            <label>Select a basemap</label>
            <Select
                options={baseMapOptions}
                values={values}
                labelField={'label'}
                valueField={'key'}
                onChange={updateBaseMap}
            />
        </Styles.BaseMapSelector>
    );
};
