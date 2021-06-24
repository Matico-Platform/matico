import React, { useState } from 'react';
import { Column, PointStyle, Layer, LayerSource } from 'types';
import { ColorSpecification, Unit } from 'types';
import {
    ColorSelector,
    ColorMappingTypes,
} from 'Components/ColorComponents/ColorSelector/ColorSelector';
import { SimpleSwitch } from 'Components/SimpleSwitch/SimpleSwitch';

interface PointLayerControlProps {
    style: PointStyle;
    onChange: (update: PointStyle) => void;
    columns: Column[];
    source: LayerSource;
}

export const PointLayerControl: React.FC<PointLayerControlProps> = ({
    onChange,
    style,
    columns,
    source,
}) => {
    const updateFill = (spec: ColorSpecification) => {
        onChange({
            ...style,
            fill: spec,
        });
    };

    const updateStroke = (spec: ColorSpecification) => {
        onChange({
            ...style,
            stroke: spec,
        });
    };

    const updateSize = (size: number) => {
        onChange({
            ...style,
            size,
        });
    };
    const updateSizeUnit = (unit: Unit) => {
        onChange({
            ...style,
            size_units: unit,
        });
    };

    const updateStrokeUnit = (unit: Unit) => {
        debugger 
        onChange({
            ...style,
            stroke_units: unit,
        });
    };

    const updateStrokeWidth = (number: number) => {
        onChange({
            ...style,
            stroke_width: number,
        });
    };

    return (
        <>
            <ColorSelector
                name="Fill Color"
                colorSpecification={style.fill}
                onUpdate={updateFill}
                columns={columns}
                source={source}
                availableTypes={[
                    ColorMappingTypes.Simple,
                    ColorMappingTypes.Category,
                ]}
            />

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
                <label>Stroke Width</label>
                <input
                    value={style.stroke_width}
                    type="number"
                    onChange={(e) =>
                        updateStrokeWidth(parseFloat(e.target.value))
                    }
                />
                <SimpleSwitch
                    options={Object.keys(Unit)}
                    selected={style.stroke_units as string}
                    onChange={(unit: string) => updateStrokeUnit(unit as Unit)}
                />
            </section>

            <section>
                <label>Size</label>
                <input
                    value={style.size}
                    type="number"
                    onChange={(e) =>
                        updateSize(parseFloat(e.target.value))
                    }
                />
                <SimpleSwitch
                    options={Object.keys(Unit)}
                    selected={style.size_units as string}
                    onChange={(unit: string) => updateSizeUnit(unit as Unit)}
                />
            </section>
        </>
    );
};
