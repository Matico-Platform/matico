import React from 'react';
import { Styles } from './SimpleSwitchStyles';

interface SimpleSwitchProps {
    selected: string;
    options: string[];
    onChange: (unit: string) => void;
}

export const SimpleSwitch: React.FC<SimpleSwitchProps> = ({
    selected,
    options,
    onChange,
}) => {

    console.log("sinple switch ", options)
    return (
        <Styles.SimpleSwitch>
            {options.map( (option)=>
                <Styles.Option
                    onClick={() => onChange(option)}
                    selected={selected === option}
                >
                   {option}
                </Styles.Option>
            )}
        </Styles.SimpleSwitch>
    );
};
