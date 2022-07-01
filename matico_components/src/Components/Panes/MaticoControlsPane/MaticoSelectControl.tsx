import React, { Key } from "react";
import { Item, Picker } from "@adobe/react-spectrum";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";

interface MaticoSelectControlInterface {
    options: Array<string | number>;
    name: string;
    defaultValue: string;
}

export const MaticoSelectControl: React.FC<MaticoSelectControlInterface> = ({
    options,
    name,
    defaultValue
}) => {
    const [value, updateValue] = useAutoVariable({
        name: `select_control_${name}`,
        type: "any",
        initialValue: null,
        bind: true
    });

    return (
        <Picker
            width={"100%"}
            items={options.map((o) => ({ key: o }))}
            selectedKey={value}
            onSelectionChange={(option) => updateValue(option)}
            label={name}
            defaultSelectedKey={defaultValue}
        >
            {(option) => <Item key={option.key}>{option.key}</Item>}
        </Picker>
    );
};
