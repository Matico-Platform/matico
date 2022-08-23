import React, { Key, useMemo } from "react";
import { Item, Picker } from "@adobe/react-spectrum";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { v4 as uuid } from "uuid";

interface MaticoSelectControlInterface {
    controlPaneId: string;
    options: Array<string | number>;
    name: string;
    defaultValue: string;
}

export const MaticoSelectControl: React.FC<MaticoSelectControlInterface> = ({
    controlPaneId,
    options,
    name,
    defaultValue
}) => {
    const id = useMemo(() => uuid(), []);
    const [value, updateValue] = useAutoVariable({
        variable: {
            id,
            paneId: controlPaneId,
            name: `select_control_${name}`,
            value: {
                type: "category",
                value: { oneOf: [] as Array<string | number>, notOneOf: [] }
            }
        },
        bind: true
    });

    return (
        <Picker
            width={"100%"}
            items={options.map((o) => ({ key: o }))}
            selectedKey={value}
            onSelectionChange={(option) =>
                updateValue({
                    type: "category",
                    value: { oneOf: [option as string], notOneOf: [] }
                })
            }
            label={name}
            defaultSelectedKey={defaultValue}
        >
            {(option) => <Item key={option.key}>{option.key}</Item>}
        </Picker>
    );
};
