import { ComboBox, Item } from "@adobe/react-spectrum";
import React, { useMemo } from "react";

export interface TextCategoryInputProps {
    allowMulti: boolean;
    options: Array<string>;
    value: Array<string>;
    onChange: (newVal: Array<string>) => void;
    label: string;
    description?: string;
}

export const TextCategoryInput: React.FC<TextCategoryInputProps> = ({
    value,
    options,
    allowMulti,
    onChange,
    label,
    description
}) => {
    const mappedOptions = useMemo(
        () => options.map((o: string) => ({ name: o, id: o })),
        [options]
    );
    console.log("TextCategoryInput ", value);

    return (
        <ComboBox
            label={label}
            description={description}
            selectedKey={value[0]}
            items={mappedOptions}
            onSelectionChange={(newVal) => {
                console.log("new val is ", newVal);
                onChange([newVal as string]);
            }}
        >
            {(item) => <Item key={item.id}>{item.name}</Item>}
        </ComboBox>
    );
};
