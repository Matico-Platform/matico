import React, { useState } from 'react';
import { Styles } from './LineLayerControlStyles';
import { Column, LineStyle, LayerSource } from 'api';
import { ColorSpecification } from 'api';
import { SimpleSwitch } from 'Components/SimpleSwitch/SimpleSwitch';

import {
    ColorSelector,
    ColorMappingTypes,
} from 'Components/ColorComponents/ColorSelector/ColorSelector';

interface LineLayerControlProps {
    style: LineStyle;
    onChange: (update: LineStyle) => void;
    columns: Column[];
    source: LayerSource;
}

export const LineLayerControl: React.FC<LineLayerControlProps> = ({
    onChange,
    style,
    columns,
    source,
}) => {
    const updateStroke = (spec: ColorSpecification) => {
        onChange({
            ...style,
            stroke: spec,
        });
    };

    const updateSize = (stroke_width: number) => {
        onChange({
            ...style,
            stroke_width,
        });
    };
    return (
        <>
            <ColorSelector
                name="Stroke Color"
                colorSpecification={style.stroke}
                onUpdate={updateStroke}
                columns={columns}
                source={source}
                availableTypes={[
                    ColorMappingTypes.Simple,
                    ColorMappingTypes.Category,
                ]}
            />
            <section>
                <label>
                    Width by <a>Number</a> <a>Value</a>
                </label>
                <input
                    value={style.stroke_width}
                    type="number"
                    onChange={(e) =>
                        updateSize(parseFloat(e.target.value))
                    }
                />
            </section>
        </>
    );
};
