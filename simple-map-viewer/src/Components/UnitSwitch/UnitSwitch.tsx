import React from 'react';
import { Styles } from './UnitSwitchStyles';
import { Unit } from 'api';

interface UnitSwitchProps {
    selected: Unit;
    onChange: (unit: Unit) => void;
}

export const UnitSwitch: React.FC<UnitSwitchProps> = ({
    selected,
    onChange,
}) => {
    return (
        <Styles.UnitSwitch>
            <Styles.Option
                onClick={() => onChange(Unit.Pixels)}
                selected={selected === Unit.Pixels}
            >
                Pixels
            </Styles.Option>
            <Styles.Option
                onClick={() => onChange(Unit.Meters)}
                selected={selected === Unit.Meters}
            >
                Meters
            </Styles.Option>
        </Styles.UnitSwitch>
    );
};
